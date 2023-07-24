/// <reference lib="dom"/>

import { isServerSide } from '../env'
import { ErrorLike, ErrorObject } from '../error/error.model'
import { _anyToError, _anyToErrorObject, _errorLikeToErrorObject } from '../error/error.util'
import { HttpRequestError } from '../error/httpRequestError'
import { _clamp } from '../number/number.util'
import {
  _filterNullishValues,
  _filterUndefinedValues,
  _mapKeys,
  _merge,
  _omit,
  _pick,
} from '../object/object.util'
import { pDelay } from '../promise/pDelay'
import { TimeoutError } from '../promise/pTimeout'
import { _jsonParse, _jsonParseIfPossible } from '../string/json.util'
import { _stringifyAny } from '../string/stringifyAny'
import { _since } from '../time/time.util'
import { NumberOfMilliseconds } from '../types'
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

      // responseType=void
      ;(this as any)[`${m}Void`] = async (url: string, opt?: FetcherOptions): Promise<void> => {
        return await this.fetch<void>({
          url,
          method,
          responseType: 'void',
          ...opt,
        })
      }

      if (method === 'HEAD') return // responseType=text
      ;(this as any)[`${m}Text`] = async (url: string, opt?: FetcherOptions): Promise<string> => {
        return await this.fetch<string>({
          url,
          method,
          responseType: 'text',
          ...opt,
        })
      }

      // Default responseType=json, but overridable
      ;(this as any)[m] = async <T = unknown>(url: string, opt?: FetcherOptions): Promise<T> => {
        return await this.fetch<T>({
          url,
          method,
          responseType: 'json',
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

  cfg: FetcherNormalizedCfg

  static create(cfg: FetcherCfg & FetcherOptions = {}): Fetcher {
    return new Fetcher(cfg)
  }

  // These methods are generated dynamically in the constructor
  // These default methods use responseType=json
  get!: <T = unknown>(url: string, opt?: FetcherOptions) => Promise<T>
  post!: <T = unknown>(url: string, opt?: FetcherOptions) => Promise<T>
  put!: <T = unknown>(url: string, opt?: FetcherOptions) => Promise<T>
  patch!: <T = unknown>(url: string, opt?: FetcherOptions) => Promise<T>
  delete!: <T = unknown>(url: string, opt?: FetcherOptions) => Promise<T>

  // responseType=text
  getText!: (url: string, opt?: FetcherOptions) => Promise<string>
  postText!: (url: string, opt?: FetcherOptions) => Promise<string>
  putText!: (url: string, opt?: FetcherOptions) => Promise<string>
  patchText!: (url: string, opt?: FetcherOptions) => Promise<string>
  deleteText!: (url: string, opt?: FetcherOptions) => Promise<string>

  // responseType=void (no body fetching/parsing)
  getVoid!: (url: string, opt?: FetcherOptions) => Promise<void>
  postVoid!: (url: string, opt?: FetcherOptions) => Promise<void>
  putVoid!: (url: string, opt?: FetcherOptions) => Promise<void>
  patchVoid!: (url: string, opt?: FetcherOptions) => Promise<void>
  deleteVoid!: (url: string, opt?: FetcherOptions) => Promise<void>
  headVoid!: (url: string, opt?: FetcherOptions) => Promise<void>

  // responseType=readableStream
  /**
   * Returns raw fetchResponse.body, which is a ReadableStream<Uint8Array>
   *
   * More on streams and Node interop:
   * https://css-tricks.com/web-streams-everywhere-and-fetch-for-node-js/
   */
  async getReadableStream(url: string, opt?: FetcherOptions): Promise<ReadableStream<Uint8Array>> {
    return await this.fetch({
      url,
      responseType: 'readableStream',
      ...opt,
    })
  }

  async fetch<T = unknown>(opt: FetcherOptions): Promise<T> {
    const res = await this.doFetch<T>(opt)
    if (res.err) {
      throw res.err
    }
    return res.body
  }

  /**
   * Returns FetcherResponse.
   * Never throws, returns `err` property in the response instead.
   * Use this method instead of `throwHttpErrors: false` or try-catching.
   */
  async doFetch<T = unknown>(opt: FetcherOptions): Promise<FetcherResponse<T>> {
    const req = this.normalizeOptions(opt)
    const { logger } = this.cfg
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
        // Apparently, providing a `string` reason to abort() causes Undici to throw `invalid_argument` error,
        // so, we're wrapping it in a TimeoutError instance
        abortController.abort(new TimeoutError(`request timed out after ${timeoutSeconds} sec`))
        // abortController.abort(`timeout of ${timeoutSeconds} sec`)
        // abortController.abort()
      }, timeoutSeconds * 1000) as any as number
    }

    for (const hook of this.cfg.hooks.beforeRequest || []) {
      await hook(req)
    }

    const isFullUrl = req.fullUrl.includes('://')
    const fullUrl = isFullUrl ? new URL(req.fullUrl) : undefined
    const shortUrl = fullUrl ? this.getShortUrl(fullUrl) : req.fullUrl
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
      req.started = Date.now()

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
        res.fetchResponse = await this.callNativeFetch(req.fullUrl, req.init)
        res.ok = res.fetchResponse.ok
        // important to set it to undefined, otherwise it can keep the previous value (from previous try)
        res.err = undefined
      } catch (err) {
        // For example, CORS error would result in "TypeError: failed to fetch" here
        // or, `fetch failed` with the cause of `unexpected redirect`
        res.err = _anyToError(err)
        res.ok = false
        // important to set it to undefined, otherwise it can keep the previous value (from previous try)
        res.fetchResponse = undefined
      }
      res.statusFamily = this.getStatusFamily(res)
      res.statusCode = res.fetchResponse?.status

      if (res.fetchResponse?.ok) {
        await this.onOkResponse(res as FetcherResponse<T> & { fetchResponse: Response }, timeout)
      } else {
        // !res.ok
        await this.onNotOkResponse(res, timeout)
      }
    }

    for (const hook of this.cfg.hooks.afterResponse || []) {
      await hook(res)
    }

    return res
  }

  private async onOkResponse(
    res: FetcherResponse<any> & { fetchResponse: Response },
    timeout?: number,
  ): Promise<void> {
    const { req } = res
    const { responseType } = res.req

    if (responseType === 'json') {
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

            return await this.onNotOkResponse(res, timeout)
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
    } else if (responseType === 'text') {
      res.body = res.fetchResponse.body ? await res.fetchResponse.text() : ''
    } else if (responseType === 'arrayBuffer') {
      res.body = res.fetchResponse.body ? await res.fetchResponse.arrayBuffer() : {}
    } else if (responseType === 'blob') {
      res.body = res.fetchResponse.body ? await res.fetchResponse.blob() : {}
    } else if (responseType === 'readableStream') {
      res.body = res.fetchResponse.body

      if (res.body === null) {
        res.err = new Error(`fetchResponse.body is null`)
        res.ok = false
        return await this.onNotOkResponse(res, timeout)
      }
    }

    clearTimeout(timeout)
    res.retryStatus.retryStopped = true

    // res.err can happen on `failed to fetch` type of error, e.g JSON.parse, CORS, unexpected redirect
    if (!res.err && this.cfg.logResponse) {
      const { retryAttempt } = res.retryStatus
      const { logger } = this.cfg
      logger.log(
        [
          ' <<',
          res.fetchResponse.status,
          res.signature,
          retryAttempt && `try#${retryAttempt + 1}/${req.retry.count + 1}`,
          _since(res.req.started),
        ]
          .filter(Boolean)
          .join(' '),
      )

      if (this.cfg.logResponseBody && res.body !== undefined) {
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

  private async onNotOkResponse(res: FetcherResponse, timeout?: number): Promise<void> {
    clearTimeout(timeout)

    let cause: ErrorObject | undefined

    if (res.err) {
      // This is only possible on JSON.parse error, or CORS error,
      // or `unexpected redirect`
      // This check should go first, to avoid calling .text() twice (which will fail)
      cause = _errorLikeToErrorObject(res.err)
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
        requestUrl: res.req.fullUrl,
        requestBaseUrl: this.cfg.baseUrl || (null as any),
        requestMethod: res.req.init.method,
        requestSignature: res.signature,
        requestDuration: Date.now() - res.req.started,
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

    // We don't log "last error", because it will be thrown and logged by consumer,
    // but we should log all previous errors, otherwise they are lost.
    // Here is the right place where we know it's not the "last error".
    // lastError = retryStatus.retryStopped
    // We need to log the response "anyway" if logResponse is true
    if (res.err && (!retryStatus.retryStopped || res.req.logResponse)) {
      this.cfg.logger.error(
        [
          ' <<',
          res.fetchResponse?.status || 0,
          res.signature,
          count &&
            (retryStatus.retryAttempt || !retryStatus.retryStopped) &&
            `try#${retryStatus.retryAttempt + 1}/${count + 1}`,
          _since(res.req.started),
        ]
          .filter(Boolean)
          .join(' ') + '\n',
        // We're stringifying the error here, otherwise Sentry shows it as [object Object]
        _stringifyAny(res.err.cause || res.err),
      )
    }

    if (retryStatus.retryStopped) return

    retryStatus.retryAttempt++
    retryStatus.retryTimeout = _clamp(retryStatus.retryTimeout * timeoutMultiplier, 0, timeoutMax)

    await pDelay(this.getRetryTimeout(res))
  }

  private getRetryTimeout(res: FetcherResponse): NumberOfMilliseconds {
    let timeout: NumberOfMilliseconds = 0

    // Handling http 429 with specific retry headers
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After
    if (res.fetchResponse && [429, 503].includes(res.fetchResponse.status)) {
      const retryAfterStr =
        res.fetchResponse.headers.get('retry-after') ??
        res.fetchResponse.headers.get('x-ratelimit-reset')
      if (retryAfterStr) {
        if (Number(retryAfterStr)) {
          timeout = Number(retryAfterStr) * 1000
        } else {
          const date = new Date(retryAfterStr)
          if (!isNaN(date as any)) {
            timeout = Number(date) - Date.now()
          }
        }

        this.cfg.logger.log(`retry-after: ${retryAfterStr}`)
        if (!timeout) {
          this.cfg.logger.warn(`retry-after could not be parsed`)
        }
      }
    }

    if (!timeout) {
      const noise = Math.random() * 500
      timeout = res.retryStatus.retryTimeout + noise
    }

    return timeout
  }

  /**
   * Default is yes,
   * unless there's reason not to (e.g method is POST).
   *
   * statusCode of 0 (or absense of it) will BE retried.
   */
  private shouldRetry(res: FetcherResponse): boolean {
    const { retryPost, retry3xx, retry4xx, retry5xx } = res.req
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
    if (statusFamily === 3 && !retry3xx) return false

    // should not retry on `unexpected redirect` in error.cause.cause
    if ((res.err?.cause as ErrorLike | void)?.cause?.message?.includes('unexpected redirect'))
      return false

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
        inputUrl: '',
        responseType: 'void',
        searchParams: {},
        timeoutSeconds: 30,
        retryPost: false,
        retry3xx: false,
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
          redirect: cfg.redirect,
        },
        hooks: {},
      },
      _omit(cfg, ['method', 'credentials', 'headers', 'redirect', 'logger']),
    )

    norm.init.headers = _mapKeys(norm.init.headers, k => k.toLowerCase())

    return norm
  }

  private normalizeOptions(opt: FetcherOptions): FetcherRequest {
    const req: FetcherRequest = {
      ..._pick(this.cfg, [
        'timeoutSeconds',
        'retryPost',
        'retry4xx',
        'retry5xx',
        'responseType',
        'jsonReviver',
        'logRequest',
        'logRequestBody',
        'logResponse',
        'logResponseBody',
      ]),
      started: Date.now(),
      ..._omit(opt, ['method', 'headers', 'credentials']),
      inputUrl: opt.url || '',
      fullUrl: opt.url || '',
      retry: {
        ...this.cfg.retry,
        ..._filterUndefinedValues(opt.retry || {}),
      },
      init: _merge(
        {
          ...this.cfg.init,
          method: opt.method || this.cfg.init.method,
          credentials: opt.credentials || this.cfg.init.credentials,
          redirect: opt.redirect || this.cfg.init.redirect || 'follow',
        },
        {
          headers: _mapKeys(opt.headers || {}, k => k.toLowerCase()),
        } as RequestInit,
      ),
    }
    // setup url
    const baseUrl = opt.baseUrl || this.cfg.baseUrl
    if (baseUrl) {
      if (req.fullUrl.startsWith('/')) {
        console.warn(`Fetcher: url should not start with / when baseUrl is specified`)
        req.fullUrl = req.fullUrl.slice(1)
      }
      req.fullUrl = `${baseUrl}/${req.inputUrl}`
    }

    const searchParams = _filterUndefinedValues({
      ...this.cfg.searchParams,
      ...opt.searchParams,
    })

    if (Object.keys(searchParams).length) {
      const qs = new URLSearchParams(searchParams).toString()
      req.fullUrl += req.fullUrl.includes('?') ? '&' : '?' + qs
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
