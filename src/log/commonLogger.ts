import { _noop } from '../index'

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

export const commonLogLevelNumber: Record<CommonLogLevel, number> = {
  log: 10,
  warn: 20,
  error: 30,
}

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
 * SimpleLogger that does nothing (noop).
 *
 * @experimental
 */
export const noopLogger: CommonLogger = {
  log: _noop,
  warn: _noop,
  error: _noop,
}

/**
 * Creates a "child" logger that is "limited" to the specified CommonLogLevel.
 */
export function commonLoggerMinLevel(
  logger: CommonLogger,
  minLevel: CommonLogLevel,
  mutate = false,
): CommonLogger {
  const level = commonLogLevelNumber[minLevel]
  if (mutate) {
    if (level > commonLogLevelNumber['log']) {
      logger.log = _noop
      if (level > commonLogLevelNumber['warn']) {
        logger.warn = _noop
        if (level > commonLogLevelNumber['error']) {
          logger.error = _noop
        }
      }
    }
    return logger
  }

  return {
    log: level <= commonLogLevelNumber['log'] ? (...args) => logger.log(...args) : _noop,
    warn: level <= commonLogLevelNumber['warn'] ? (...args) => logger.warn(...args) : _noop,
    error: level <= commonLogLevelNumber['error'] ? (...args) => logger.error(...args) : _noop,
  }
}
