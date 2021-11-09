/**
 * These levels follow console.* naming,
 * so you can use console[level] safely.
 *
 * `log` is considered default level.
 *
 * For simplicity - only these 3 levels are kept.
 *
 * @experimental
 */
export type CommonLogLevel = 'log' | 'warn' | 'error'

/**
 * Function that takes any number of arguments and logs them all.
 * It is expected that logged arguments are separated by "space", like console.log does.
 *
 * @experimental
 */
export type CommonLogFunction = (...args: any[]) => void

/**
 * Interface is inspired/compatible with `console.*`
 * So, `console` is a valid CommonLogger implementation as-is.
 *
 * @experimental
 */
export interface CommonLogger {
  log: CommonLogFunction
  warn: CommonLogFunction
  error: CommonLogFunction
}

/**
 * Same as CommonLogger, but also is a "convenience function" itself.
 * So you can do `logger('hey')` which is the same as `logger.log('hey')`
 *
 * @experimental
 */
export interface SimpleLogger extends CommonLogFunction, CommonLogger {}

/**
 * Creates a SimpleLogger from CommonLogger.
 *
 * @experimental
 */
export function createSimpleLogger(logger: CommonLogger): SimpleLogger {
  return Object.assign(((...args: any[]) => logger.log(...args)) as any, {
    log: (...args: any[]) => logger.log(...args),
    warn: (...args: any[]) => logger.warn(...args),
    error: (...args: any[]) => logger.error(...args),
  })
}

const noop = () => {}

/**
 * SimpleLogger that does nothing (noop).
 *
 * @experimental
 */
export const noopLogger: SimpleLogger = createSimpleLogger({
  log: noop,
  warn: noop,
  error: noop,
})
