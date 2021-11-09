import { CommonLogger, createSimpleLogger, noopLogger } from './commonLogger'

// This "tests" that `console` is a valid CommonLogger by itself
const consoleLogger: CommonLogger = console

test('commonLogger', () => {
  consoleLogger.log('hello')
  consoleLogger.warn('hello')
  consoleLogger.error('hello')
})

test('createSimpleLogger', () => {
  const logger = createSimpleLogger(console)
  logger('hey')
  logger.log('hey')
  logger.warn('hey')
  logger.error('hey')
})

test('noopLogger', () => {
  const logger = noopLogger
  logger('hey')
  logger.log('hey')
  logger.warn('hey')
  logger.error('hey')
})
