import type { CommonLogger } from '../log/commonLogger'
import type { Promisable } from '../typeFest'
import type { Reviver } from '../types'
import type { HttpMethod, HttpStatusFamily } from './http.model'

export interface FetcherNormalizedCfg extends Required<FetcherCfg>, FetcherRequest {
  logger: CommonLogger
  searchParams: Record<string, any>
}

export type FetcherBeforeRequestHook = (req: FetcherRequest) => Promisable<void>
export type FetcherAfterResponseHook = (res: FetcherResponse) => Promisable<void>
export type FetcherBeforeRetryHook = (res: FetcherResponse) => Promisable<void>

export interface FetcherCfg {
  /**
   * Should **not** contain trailing slash.
   */
  baseUrl?: string

  /**
   * Default rule is that you **are allowed** to mutate req, res, res.retryStatus
   * properties of hook function arguments.
   * If you throw an error from the hook - it will be re-thrown as-is.
   */
  hooks?: {
    /**
     * Allows to mutate req.
     */
    beforeRequest?: FetcherBeforeRequestHook[]
    /**
     * Allows to mutate res.
     * If you set `res.err` - it will be thrown.
     */
    afterResponse?: FetcherAfterResponseHook[]
    /**
     * Allows to mutate res.retryStatus to override retry behavior.
     */
    beforeRetry?: FetcherBeforeRetryHook[]
  }

  /**
   * If true - enables all possible logging.
   */
  debug?: boolean
  logRequest?: boolean
  logRequestBody?: boolean
  logResponse?: boolean
  logResponseBody?: boolean

  /**
   * Controls if `baseUrl` should be included in logs (both success and error).
   *
   * Defaults to `true` on ServerSide and `false` on ClientSide.
   *
   * Reasoning.
   *
   * ClientSide often uses one main "backend host".
   * Not including baseUrl improves Sentry error grouping.
   *
   * ServerSide often uses one Fetcher instance per 3rd-party API.
   * Not including baseUrl can introduce confusion of "which API is it?".
   */
  logWithBaseUrl?: boolean

  /**
   * Default to true.
   * Set to false to strip searchParams from url when logging (both success and error)
   */
  logWithSearchParams?: boolean

  /**
   * Defaults to `console`.
   */
  logger?: CommonLogger
}

export interface FetcherRetryStatus {
  retryAttempt: number
  retryTimeout: number
  retryStopped: boolean
}

export interface FetcherRetryOptions {
  count: number
  timeout: number
  timeoutMax: number
  timeoutMultiplier: number
}

export interface FetcherRequest extends Omit<FetcherOptions, 'method' | 'headers' | 'baseUrl'> {
  url: string
  init: RequestInitNormalized
  mode: FetcherMode
  throwHttpErrors: boolean
  timeoutSeconds: number
  retry: FetcherRetryOptions
  retryPost: boolean
  retry4xx: boolean
  retry5xx: boolean
}

export interface FetcherOptions {
  method?: HttpMethod

  baseUrl?: string

  throwHttpErrors?: boolean
  /**
   * Default: 30.
   *
   * Timeout applies to both get the response and retrieve the body (e.g `await res.json()`),
   * so both should finish within this single timeout (not each).
   */
  timeoutSeconds?: number

  json?: any
  text?: string
  /**
   * Supports all the types that RequestInit.body supports.
   *
   * Useful when you want to e.g pass FormData.
   */
  body?: Blob | BufferSource | FormData | URLSearchParams | string

  credentials?: RequestCredentials
  /**
   * Default to true.
   */
  followRedirects?: boolean

  // Removing RequestInit from options to simplify FetcherOptions interface.
  // Will instead only add hand-picked useful options, such as `credentials`.
  // init?: Partial<RequestInitNormalized>

  headers?: Record<string, any>
  mode?: FetcherMode // default to 'void'

  searchParams?: Record<string, any>

  /**
   * Default is 2 retries (3 tries in total).
   * Pass `retry: { count: 0 }` to disable retries.
   */
  retry?: Partial<FetcherRetryOptions>

  /**
   * Defaults to false.
   * Set to true to allow retrying `post` requests.
   */
  retryPost?: boolean
  /**
   * Defaults to false.
   */
  retry4xx?: boolean
  /**
   * Defaults to true.
   */
  retry5xx?: boolean

  jsonReviver?: Reviver
}

export type RequestInitNormalized = Omit<RequestInit, 'method' | 'headers'> & {
  method: HttpMethod
  headers: Record<string, any>
}

export interface FetcherSuccessResponse<BODY = unknown> {
  ok: true
  err: undefined
  fetchResponse: Response
  body: BODY
  req: FetcherRequest
  statusFamily?: HttpStatusFamily
  retryStatus: FetcherRetryStatus
  signature: string
}

export interface FetcherErrorResponse<BODY = unknown> {
  ok: false
  err: Error
  fetchResponse?: Response
  body?: BODY
  req: FetcherRequest
  statusFamily?: HttpStatusFamily
  retryStatus: FetcherRetryStatus
  signature: string
}

export type FetcherResponse<BODY = unknown> =
  | FetcherSuccessResponse<BODY>
  | FetcherErrorResponse<BODY>

export type FetcherMode = 'json' | 'text' | 'void' | 'arrayBuffer' | 'blob' | 'readableStream'
