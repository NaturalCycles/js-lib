/// <reference lib="dom"/>

import { isServerSide } from '../env'
import { ErrorObject } from '../error/error.model'
import { _anyToError, _anyToErrorObject, _errorToErrorObject } from '../error/error.util'
import { HttpRequestError } from '../error/httpRequestError'
import { _clamp } from '../number/number.util'
import {
  _filterNullishValues,
  _filterUndefinedValues,
  _mapKeys,
  _merge,
  _omit,
} from '../object/object.util'
import { pDelay } from '../promise/pDelay'
import { _jsonParse, _jsonParseIfPossible } from '../string/json.util'
import { _since } from '../time/time.util'
import { UnixTimestampNumber } from '../types'
import type {
  FetcherAfterResponseHook,
  FetcherBeforeRequestHook,
  FetcherBeforeRetryHook,
  FetcherCfg,
  FetcherNormalizedCfg,
  FetcherOptions,
  FetcherRequest,
  FetcherResponse,
  FetcherRetryOptions,
} from './fetcher.model'
import { HTTP_METHODS } from './http.model'
import type { HttpStatusFamily } from './http.model'

const defRetryOptions: FetcherRetryOptions = {
  count: 2,
  timeout: 1000,
  timeoutMax: 30_000,
  timeoutMultiplier: 2,
}

/**
 * Experimental wrapper around Fetch.
 * Works in both Browser and Node, using `globalThis.fetch`.
 */
export class Fetcher {
  private constructor(cfg: FetcherCfg & FetcherOptions = {}) {
    if (typeof globalThis.fetch !== 'function') {
      throw new TypeError(`globalThis.fetch is not available`)
    }

    this.cfg = this.normalizeCfg(cfg)

    // Dynamically create all helper methods
    HTTP_METHODS.forEach(method => {
      const m = method.toLowerCase()

      // mode=void
      ;(this as any)[`${m}Void`] = async (url: string, opt?: FetcherOptions): Promise<void> => {
        return await this.fetch<void>(url, {
          method,
          mode: 'void',
          ...opt,
        })
      }

      if (method === 'HEAD') return // mode=text
      ;(this as any)[`${m}Text`] = async (url: string, opt?: FetcherOptions): Promise<string> => {
        return await this.fetch<string>(url, {
          method,
          mode: 'text',
          ...opt,
        })
      }

      // Default mode=json, but overridable
      ;(this as any)[m] = async <T = unknown>(url: string, opt?: FetcherOptions): Promise<T> => {
        return await this.fetch<T>(url, {
          method,
          mode: 'json',
          ...opt,
        })
      }
    })
  }

  /**
   * Add BeforeRequest hook at the end of the hooks list.
   */
  onBeforeRequest(hook: FetcherBeforeRequestHook): this {
    ;(this.cfg.hooks.beforeRequest ||= []).push(hook)
    return this
  }

  onAfterResponse(hook: FetcherAfterResponseHook): this {
    ;(this.cfg.hooks.afterResponse ||= []).push(hook)
    return this
  }

  onBeforeRetry(hook: FetcherBeforeRetryHook): this {
    ;(this.cfg.hooks.beforeRetry ||= []).push(hook)
    return this
  }

  public cfg: FetcherNormalizedCfg

  static create(cfg: FetcherCfg & FetcherOptions = {}): Fetcher {
    return new Fetcher(cfg)
  }

  // These methods are generated dynamically in the constructor
  // These default methods use mode=json
  get!: <T = unknown>(url: string, opt?: FetcherOptions) => Promise<T>
  post!: <T = unknown>(url: string, opt?: FetcherOptions) => Promise<T>
  put!: <T = unknown>(url: string, opt?: FetcherOptions) => Promise<T>
  patch!: <T = unknown>(url: string, opt?: FetcherOptions) => Promise<T>
  delete!: <T = unknown>(url: string, opt?: FetcherOptions) => Promise<T>

  // mode=text
  getText!: (url: string, opt?: FetcherOptions) => Promise<string>
  postText!: (url: string, opt?: FetcherOptions) => Promise<string>
  putText!: (url: string, opt?: FetcherOptions) => Promise<string>
  patchText!: (url: string, opt?: FetcherOptions) => Promise<string>
  deleteText!: (url: string, opt?: FetcherOptions) => Promise<string>

  // mode=void (no body fetching/parsing)
  getVoid!: (url: string, opt?: FetcherOptions) => Promise<void>
  postVoid!: (url: string, opt?: FetcherOptions) => Promise<void>
  putVoid!: (url: string, opt?: FetcherOptions) => Promise<void>
  patchVoid!: (url: string, opt?: FetcherOptions) => Promise<void>
  deleteVoid!: (url: string, opt?: FetcherOptions) => Promise<void>
  headVoid!: (url: string, opt?: FetcherOptions) => Promise<void>

  // mode=readableStream
  /**
   * Returns raw fetchResponse.body, which is a ReadableStream<Uint8Array>
   *
   * More on streams and Node interop:
   * https://css-tricks.com/web-streams-everywhere-and-fetch-for-node-js/
   */
  async getReadableStream(url: string, opt?: FetcherOptions): Promise<ReadableStream<Uint8Array>> {
    return await this.fetch(url, {
      mode: 'readableStream',
      ...opt,
    })
  }

  async fetch<T = unknown>(url: string, opt?: FetcherOptions): Promise<T> {
    const res = await this.doFetch<T>(url, opt)
    if (res.err) {
      if (res.req.throwHttpErrors) throw res.err
      return res as any
    }
    return res.body
  }

  /**
   * Returns FetcherResponse.
   * Never throws, returns `err` property in the response instead.
   * Use this method instead of `throwHttpErrors: false` or try-catching.
   */
  async doFetch<T = unknown>(
    url: string,
    rawOpt: FetcherOptions = {},
  ): Promise<FetcherResponse<T>> {
    const { logger } = this.cfg

    const req = this.normalizeOptions(url, rawOpt)
    const {
      timeoutSeconds,
      init: { method },
    } = req

    // setup timeout
    let timeout: number | undefined
    if (timeoutSeconds) {
      const abortController = new AbortController()
      req.init.signal = abortController.signal
      timeout = setTimeout(() => {
        abortController.abort(`timeout of ${timeoutSeconds} sec`)
      }, timeoutSeconds * 1000) as any as number
    }

    for (const hook of this.cfg.hooks.beforeRequest || []) {
      await hook(req)
    }

    const isFullUrl = req.url.includes('://')
    const fullUrl = isFullUrl ? new URL(req.url) : undefined
    const shortUrl = fullUrl ? this.getShortUrl(fullUrl) : req.url
    const signature = [method, shortUrl].join(' ')

    const res = {
      req,
      retryStatus: {
        retryAttempt: 0,
        retryStopped: false,
        retryTimeout: req.retry.timeout,
      },
      signature,
    } as FetcherResponse<any>

    while (!res.retryStatus.retryStopped) {
      const started = Date.now()

      if (this.cfg.logRequest) {
        const { retryAttempt } = res.retryStatus
        logger.log(
          [' >>', signature, retryAttempt && `try#${retryAttempt + 1}/${req.retry.count + 1}`]
            .filter(Boolean)
            .join(' '),
        )
        if (this.cfg.logRequestBody && req.init.body) {
          logger.log(req.init.body) // todo: check if we can _inspect it
        }
      }

      try {
        res.fetchResponse = await this.callNativeFetch(req.url, req.init)
        res.ok = res.fetchResponse.ok
      } catch (err) {
        // For example, CORS error would result in "TypeError: failed to fetch" here
        res.err = err as Error
        res.ok = false
        // important to set it to undefined, otherwise it can keep the previous value (from previous try)
        res.fetchResponse = undefined
      }
      res.statusFamily = this.getStatusFamily(res)

      if (res.fetchResponse?.ok) {
        await this.onOkResponse(
          res as FetcherResponse<T> & { fetchResponse: Response },
          started,
          timeout,
        )
      } else {
        // !res.ok
        await this.onNotOkResponse(res, started, timeout)
      }
    }

    for (const hook of this.cfg.hooks.afterResponse || []) {
      await hook(res)
    }

    return res
  }

  private async onOkResponse(
    res: FetcherResponse<any> & { fetchResponse: Response },
    started: UnixTimestampNumber,
    timeout?: number,
  ): Promise<void> {
    const { req } = res
    const { mode } = res.req

    if (mode === 'json') {
      if (res.fetchResponse.body) {
        const text = await res.fetchResponse.text()

        if (text) {
          try {
            res.body = text
            res.body = _jsonParse(text, req.jsonReviver)
          } catch (err) {
            // Error while parsing json
            // res.err = _anyToError(err, HttpRequestError, {
            //   requestUrl: res.req.url,
            //   requestBaseUrl: this.cfg.baseUrl,
            //   requestMethod: res.req.init.method,
            //   requestSignature: res.signature,
            //   requestDuration: Date.now() - started,
            //   responseStatusCode: res.fetchResponse.status,
            // } satisfies HttpRequestErrorData)
            res.err = _anyToError(err)
            res.ok = false

            return await this.onNotOkResponse(res, started, timeout)
          }
        } else {
          // Body had a '' (empty string)
          res.body = {}
        }
      } else {
        // if no body: set responseBody as {}
        // do not throw a "cannot parse null as Json" error
        res.body = {}
      }
    } else if (mode === 'text') {
      res.body = res.fetchResponse.body ? await res.fetchResponse.text() : ''
    } else if (mode === 'arrayBuffer') {
      res.body = res.fetchResponse.body ? await res.fetchResponse.arrayBuffer() : {}
    } else if (mode === 'blob') {
      res.body = res.fetchResponse.body ? await res.fetchResponse.blob() : {}
    } else if (mode === 'readableStream') {
      res.body = res.fetchResponse.body

      if (res.body === null) {
        res.err = new Error(`fetchResponse.body is null`)
        res.ok = false
        return await this.onNotOkResponse(res, started, timeout)
      }
    }

    clearTimeout(timeout)
    res.retryStatus.retryStopped = true

    // res.err can happen on JSON.parse error
    if (!res.err && this.cfg.logResponse) {
      const { retryAttempt } = res.retryStatus
      const { logger } = this.cfg
      logger.log(
        [
          ' <<',
          res.fetchResponse.status,
          res.signature,
          retryAttempt && `try#${retryAttempt + 1}/${req.retry.count + 1}`,
          _since(started),
        ]
          .filter(Boolean)
          .join(' '),
      )

      if (this.cfg.logResponseBody) {
        logger.log(res.body)
      }
    }
  }

  /**
   * This method exists to be able to easily mock it.
   */
  async callNativeFetch(url: string, init: RequestInit): Promise<Response> {
    return await globalThis.fetch(url, init)
  }

  private async onNotOkResponse(
    res: FetcherResponse,
    started: UnixTimestampNumber,
    timeout?: number,
  ): Promise<void> {
    clearTimeout(timeout)

    let cause: ErrorObject | undefined

    if (res.err) {
      // This is only possible on JSON.parse error (or CORS error!)
      // This check should go first, to avoid calling .text() twice (which will fail)
      cause = _errorToErrorObject(res.err)
    } else if (res.fetchResponse) {
      const body = _jsonParseIfPossible(await res.fetchResponse.text())
      if (body) {
        cause = _anyToErrorObject(body)
      }
    }

    const message = [res.fetchResponse?.status, res.signature].filter(Boolean).join(' ')

    res.err = new HttpRequestError(
      message,
      _filterNullishValues({
        responseStatusCode: res.fetchResponse?.status || 0,
        // These properties are provided to be used in e.g custom Sentry error grouping
        // Actually, disabled now, to avoid unnecessary error printing when both msg and data are printed
        // Enabled, cause `data` is not printed by default when error is HttpError
        // method: req.method,
        // tryCount: req.tryCount,
        requestUrl: res.req.url,
        requestBaseUrl: this.cfg.baseUrl || (null as any),
        requestMethod: res.req.init.method,
        requestSignature: res.signature,
        requestDuration: Date.now() - started,
      }),
      cause,
    )

    await this.processRetry(res)
  }

  private async processRetry(res: FetcherResponse): Promise<void> {
    const { retryStatus } = res

    if (!this.shouldRetry(res)) {
      retryStatus.retryStopped = true
    }

    for (const hook of this.cfg.hooks.beforeRetry || []) {
      await hook(res)
    }

    const { count, timeoutMultiplier, timeoutMax } = res.req.retry

    if (retryStatus.retryAttempt >= count) {
      retryStatus.retryStopped = true
    }

    if (retryStatus.retryStopped) return

    retryStatus.retryAttempt++
    retryStatus.retryTimeout = _clamp(retryStatus.retryTimeout * timeoutMultiplier, 0, timeoutMax)

    const noise = Math.random() * 500
    await pDelay(retryStatus.retryTimeout + noise)
  }

  /**
   * Default is yes,
   * unless there's reason not to (e.g method is POST).
   *
   * statusCode of 0 (or absense of it) will BE retried.
   */
  private shouldRetry(res: FetcherResponse): boolean {
    const { retryPost, retry4xx, retry5xx } = res.req
    const { method } = res.req.init
    if (method === 'POST' && !retryPost) return false
    const { statusFamily } = res
    const statusCode = res.fetchResponse?.status || 0
    if (statusFamily === 5 && !retry5xx) return false
    if ([408, 429].includes(statusCode)) {
      // these codes are always retried
      return true
    }
    if (statusFamily === 4 && !retry4xx) return false
    return true // default is true
  }

  private getStatusFamily(res: FetcherResponse): HttpStatusFamily | undefined {
    const status = res.fetchResponse?.status
    if (!status) return
    if (status >= 500) return 5
    if (status >= 400) return 4
    if (status >= 300) return 3
    if (status >= 200) return 2
    if (status >= 100) return 1
  }

  /**
   * Returns url without baseUrl and before ?queryString
   */
  private getShortUrl(url: URL): string {
    const { baseUrl } = this.cfg

    if (url.password) {
      url = new URL(url.toString()) // prevent original url mutation
      url.password = '[redacted]'
    }

    let shortUrl = url.toString()

    if (!this.cfg.logWithSearchParams) {
      shortUrl = shortUrl.split('?')[0]!
    }

    if (!this.cfg.logWithBaseUrl && baseUrl && shortUrl.startsWith(baseUrl)) {
      shortUrl = shortUrl.slice(baseUrl.length)
    }

    return shortUrl
  }

  private normalizeCfg(cfg: FetcherCfg & FetcherOptions): FetcherNormalizedCfg {
    if (cfg.baseUrl?.endsWith('/')) {
      console.warn(`Fetcher: baseUrl should not end with /`)
      cfg.baseUrl = cfg.baseUrl.slice(0, cfg.baseUrl.length - 1)
    }
    const { debug = false } = cfg

    const norm: FetcherNormalizedCfg = _merge(
      {
        baseUrl: '',
        url: '',
        mode: 'void',
        searchParams: {},
        timeoutSeconds: 30,
        throwHttpErrors: true,
        retryPost: false,
        retry4xx: false,
        retry5xx: true,
        // logger: console, Danger! doing this mutates console!
        logger: cfg.logger || console,
        debug,
        logRequest: debug,
        logRequestBody: debug,
        logResponse: debug,
        logResponseBody: debug,
        logWithBaseUrl: isServerSide(),
        logWithSearchParams: true,
        retry: { ...defRetryOptions },
        init: {
          method: cfg.method || 'GET',
          headers: cfg.headers || {},
          credentials: cfg.credentials,
        },
        hooks: {},
      },
      _omit(cfg, ['method', 'credentials', 'headers', 'logger']),
    )

    norm.init.headers = _mapKeys(norm.init.headers, k => k.toLowerCase())

    return norm
  }

  private normalizeOptions(url: string, opt: FetcherOptions): FetcherRequest {
    const {
      timeoutSeconds,
      throwHttpErrors,
      retryPost,
      retry4xx,
      retry5xx,
      retry,
      mode,
      jsonReviver,
    } = this.cfg

    const req: FetcherRequest = {
      mode,
      url,
      timeoutSeconds,
      throwHttpErrors,
      retryPost,
      retry4xx,
      retry5xx,
      jsonReviver,
      ..._omit(opt, ['method', 'headers', 'credentials']),
      retry: {
        ...retry,
        ..._filterUndefinedValues(opt.retry || {}),
      },
      init: _merge(
        {
          ...this.cfg.init,
          method: opt.method || this.cfg.init.method,
          credentials: opt.credentials || this.cfg.init.credentials,
          redirect: opt.followRedirects ?? this.cfg.followRedirects ?? true ? 'follow' : 'error',
        },
        {
          headers: _mapKeys(opt.headers || {}, k => k.toLowerCase()),
        } as RequestInit,
      ),
    }

    // setup url
    const baseUrl = opt.baseUrl || this.cfg.baseUrl
    if (baseUrl) {
      if (url.startsWith('/')) {
        console.warn(`Fetcher: url should not start with / when baseUrl is specified`)
        url = url.slice(1)
      }
      req.url = `${baseUrl}/${url}`
    }

    const searchParams = _filterUndefinedValues({
      ...this.cfg.searchParams,
      ...opt.searchParams,
    })

    if (Object.keys(searchParams).length) {
      const qs = new URLSearchParams(searchParams).toString()
      req.url += req.url.includes('?') ? '&' : '?' + qs
    }

    // setup request body
    if (opt.json !== undefined) {
      req.init.body = JSON.stringify(opt.json)
      req.init.headers['content-type'] = 'application/json'
    } else if (opt.text !== undefined) {
      req.init.body = opt.text
      req.init.headers['content-type'] = 'text/plain'
    } else if (opt.body !== undefined) {
      req.init.body = opt.body
    }

    return req
  }
}

export function getFetcher(cfg: FetcherCfg & FetcherOptions = {}): Fetcher {
  return Fetcher.create(cfg)
}
