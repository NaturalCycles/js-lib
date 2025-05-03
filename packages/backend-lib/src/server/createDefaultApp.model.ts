import type { Options, OptionsJson, OptionsUrlencoded } from 'body-parser'
import type { CorsOptions } from 'cors'
import type { SentrySharedService } from '../sentry/sentry.shared.service.js'
import type { GenericErrorMiddlewareCfg } from './genericErrorMiddleware.js'
import type { BackendRequestHandler } from './server.model.js'

/**
 * Plain RequestHandler can be provided - then it's mounted to /
 * Otherwise `path` can be provided to specify mounting point.
 */
export type BackendRequestHandlerCfg = BackendRequestHandler | BackendRequestHandlerWithPath

export interface BackendRequestHandlerWithPath {
  path: string
  handler: BackendRequestHandler
}

/**
 * Handlers are used in this order:
 *
 * 1. preHandlers
 * 2. handlers
 * 3. resources
 * 4. postHandlers
 */
export interface DefaultAppCfg {
  preHandlers?: BackendRequestHandlerCfg[]
  handlers?: BackendRequestHandlerCfg[]
  resources?: BackendRequestHandlerCfg[]
  postHandlers?: BackendRequestHandlerCfg[]

  sentryService?: SentrySharedService

  bodyParserJsonOptions?: OptionsJson
  bodyParserUrlEncodedOptions?: OptionsUrlencoded
  bodyParserRawOptions?: Options

  corsOptions?: CorsOptions

  genericErrorMwCfg?: GenericErrorMiddlewareCfg
}
