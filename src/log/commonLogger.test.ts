import { CommonLogger, commonLoggerMinLevel, noopLogger } from './commonLogger'

// This "tests" that `console` is a valid CommonLogger by itself
const consoleLogger: CommonLogger = console

test('commonLogger', () => {
  consoleLogger.log('hello')
  consoleLogger.warn('hello')
  consoleLogger.error('hello')
})

test('noopLogger', () => {
  const logger = noopLogger
  logger.log('hey')
  logger.warn('hey')
  logger.error('hey')
})

test('commonLoggerMinLevel', () => {
  const logger = commonLoggerMinLevel(console, 'warn')
  logger.log('hey') // should be silent
  logger.warn('hey') // verbose
  logger.error('hey') // verbose
})
