import { test } from 'vitest'
import type { CommonLogger, CommonLogWithLevelFunction } from './commonLogger.js'
import {
  commonLoggerCreate,
  commonLoggerMinLevel,
  commonLoggerNoop,
  commonLoggerPipe,
  commonLoggerPrefix,
} from './commonLogger.js'

// This "tests" that `console` is a valid CommonLogger by itself
const consoleLogger: CommonLogger = console

test('commonLogger', () => {
  consoleLogger.log('hello')
  consoleLogger.warn('hello')
  consoleLogger.error('hello')
})

test('noopLogger', () => {
  const logger = commonLoggerNoop
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

test('commonLoggerPipe', () => {
  const logger = commonLoggerPipe([console, console])
  logger.log('hey') // should be said twice
})

test('commonLoggerPrefix', () => {
  const logger = commonLoggerPrefix(console, '[mongo]')
  logger.log('hey')
})

test('commonLoggerCreate', () => {
  const fn: CommonLogWithLevelFunction = (level, args) => console[level](...args)

  const logger = commonLoggerCreate(fn)
  logger.log('hey')
  logger.warn('hey')
  logger.error('hey')
})
