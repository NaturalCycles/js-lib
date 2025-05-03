import { inspect } from 'node:util'
import type { AnyObject, CommonLogger } from '@naturalcycles/js-lib'
import { _inspect, dimGrey } from '@naturalcycles/nodejs-lib'
import type { BackendRequestHandler } from './server.model.js'

const { GOOGLE_CLOUD_PROJECT, GAE_INSTANCE, APP_ENV } = process.env
const isGAE = !!GAE_INSTANCE
// const isCloudRun = !!K_SERVICE
// const isTest = APP_ENV === 'test'
const isDev = APP_ENV === 'dev'

// Simple "request counter" (poor man's "correlation id") counter, to use on dev machine (not in the cloud)
let reqCounter = 0

/**
 * Logger that logs in AppEngine format.
 * To be used in outside-of-request situations (otherwise req.log should be used).
 */
export const gaeLogger: CommonLogger = {
  log: (...args) => logToAppEngine({}, args),
  warn: (...args) => logToAppEngine({ severity: 'WARNING' }, args),
  error: (...args) => logToAppEngine({ severity: 'ERROR' }, args),
}

/**
 * Fancy development logger, to be used in outside-of-request situations
 * (otherwise req.log should be used).
 */
export const devLogger: CommonLogger = {
  log: (...args) => logToDev(null, args),
  warn: (...args) => logToDev(null, args),
  error: (...args) => logToDev(null, args),
}

/**
 * Same as devLogger, but without colors (e.g to not confuse Sentry).
 */
export const ciLogger: CommonLogger = {
  log: (...args) => logToCI(args),
  warn: (...args) => logToCI(args),
  error: (...args) => logToCI(args),
}

// Documented here: https://cloud.google.com/logging/docs/structured-logging
function logToAppEngine(meta: AnyObject, args: any[]): void {
  console.log(
    JSON.stringify({
      message: args.map(a => (typeof a === 'string' ? a : inspect(a))).join(' '),
      ...meta,
    }),
  )
}

function logToDev(requestId: string | null, args: any[]): void {
  // Run on local machine
  console.log(
    [
      requestId ? [dimGrey(`[${requestId}]`)] : [],
      ...args.map(a => _inspect(a, { includeErrorStack: true, colors: true })),
    ].join(' '),
  )
}

/**
 * Same as logToDev, but without request and without colors.
 * This is to not confuse e.g Sentry when it picks up messages with colors
 */
function logToCI(args: any[]): void {
  console.log(args.map(a => _inspect(a, { includeErrorStack: true, colors: false })).join(' '))
}

export function logMiddleware(): BackendRequestHandler {
  if (isGAE) {
    if (GOOGLE_CLOUD_PROJECT) {
      return function appEngineLogHandler(req, _res, next) {
        const traceHeader = req.header('x-cloud-trace-context')
        if (traceHeader) {
          const [trace] = traceHeader.split('/')
          const meta = {
            'logging.googleapis.com/trace': `projects/${GOOGLE_CLOUD_PROJECT}/traces/${trace}`,
            'appengine.googleapis.com/request_id': req.header('x-appengine-request-log-id'),
          }
          Object.assign(req, {
            log: (...args: any[]) => logToAppEngine({ ...meta, severity: 'INFO' }, args),
            warn: (...args: any[]) => logToAppEngine({ ...meta, severity: 'WARNING' }, args),
            error: (...args: any[]) => logToAppEngine({ ...meta, severity: 'ERROR' }, args),
          })
          req.requestId = trace
        } else {
          Object.assign(req, gaeLogger)
        }

        next()
      }
    }

    return function appEngineLogHandler(req, _res, next) {
      Object.assign(req, gaeLogger)
      next()
    }
  }

  if (isDev) {
    // Local machine, return "simple" logToDev middleware with request numbering
    return function devLogHandler(req, _res, next) {
      // Local machine
      req.requestId = String(++reqCounter)
      req.log = req.warn = req.error = (...args: any[]) => logToDev(req.requestId!, args)
      next()
    }
  }

  // Otherwise, return "simple" logger
  // This includes: unit tests, CloudRun, CI environments
  return function simpleLogHandler(req, _res, next) {
    req.log = req.warn = req.error = (...args: any[]) => logToCI(args)
    next()
  }
}
