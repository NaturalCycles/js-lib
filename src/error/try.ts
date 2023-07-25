import { _stringifyAny } from '../string/stringifyAny'
import type { Class } from '../typeFest'
import type { AnyFunction, ErrorDataTuple } from '../types'
import { AppError } from './app.error'
import { _assertErrorClassOrRethrow } from './assert'

/**
 * Calls a function, returns a Tuple of [error, value].
 * Allows to write shorter code that avoids `try/catch`.
 * Useful e.g. in unit tests.
 *
 * Similar to pTry, but for sync functions.
 *
 * ERR is typed as Error, not `unknown`. While unknown would be more correct,
 * according to recent TypeScript, Error gives more developer convenience.
 * In our code we NEVER throw non-errors.
 * Only possibility of non-error is in the 3rd-party library code, in these cases it
 * can be manually cast to `unknown` for extra safety.
 *
 * @example
 *
 * const [err, v] = _try(() => someFunction())
 * if (err) ...do something...
 * v // go ahead and use v
 */
export function _try<T, ERR extends Error = Error>(
  fn: () => T,
  errorClass?: Class<ERR>,
): ErrorDataTuple<T, ERR> {
  try {
    return [null, fn()]
  } catch (err) {
    if (errorClass) {
      _assertErrorClassOrRethrow(err, errorClass)
    }

    return [err as ERR, null]
  }
}

/**
 * Like _try, but for Promises.
 */
export async function pTry<T, ERR extends Error = Error>(
  promise: Promise<T>,
  errorClass?: Class<ERR>,
): Promise<ErrorDataTuple<Awaited<T>, ERR>> {
  try {
    return [null, await promise]
  } catch (err) {
    if (errorClass) {
      _assertErrorClassOrRethrow(err, errorClass)
    }
    return [err as ERR, null]
  }
}

/**
 * It is thrown when Error was expected, but didn't happen
 * ("pass" happened instead).
 * "Pass" means "no error".
 */
export class UnexpectedPassError extends AppError {
  constructor() {
    super('expected error was not thrown', {}, undefined, 'UnexpectedPassError')
  }
}

/**
 * Calls `fn`, expects is to throw, catches the expected error and returns.
 * If error was NOT thrown - throws UnexpectedPassError instead.
 *
 * If `errorClass` is passed:
 * 1. It automatically infers it's type
 * 2. It does `instanceof` check and throws if wrong Error instance was thrown.
 */
export function _expectedError<ERR = Error>(fn: AnyFunction, errorClass?: Class<ERR>): ERR {
  try {
    fn()
    // Unexpected!
    throw new UnexpectedPassError()
  } catch (err) {
    if (err instanceof UnexpectedPassError) throw err // re-throw
    if (errorClass && !(err instanceof errorClass)) {
      console.warn(
        `_expectedError expected ${errorClass.constructor.name} but got different error class`,
      )
      throw err
    }
    return err as ERR // this is expected!
  }
}

/**
 * Awaits passed `promise`, expects is to throw (reject), catches the expected error and returns.
 * If error was NOT thrown - throws UnexpectedPassError instead.
 *
 * If `errorClass` is passed:
 * 1. It automatically infers it's type
 * 2. It does `instanceof` check and throws if wrong Error instance was thrown.
 */
export async function pExpectedError<ERR = Error>(
  promise: Promise<any>,
  errorClass?: Class<ERR>,
): Promise<ERR> {
  try {
    await promise
    // Unexpected!
    throw new UnexpectedPassError()
  } catch (err) {
    if (err instanceof UnexpectedPassError) throw err // re-throw
    if (errorClass && !(err instanceof errorClass)) {
      console.warn(
        `pExpectedError expected ${errorClass.constructor.name} but got different error class`,
      )
      throw err
    }
    return err as ERR // this is expected!
  }
}

/**
 * Shortcut function to simplify error snapshot-matching in tests.
 */
export async function pExpectedErrorString<ERR = Error>(
  promise: Promise<any>,
  errorClass?: Class<ERR>,
): Promise<string> {
  const err = await pExpectedError<ERR>(promise, errorClass)
  return _stringifyAny(err)
}

/**
 * Shortcut function to simplify error snapshot-matching in tests.
 */
export function _expectedErrorString<ERR = Error>(
  fn: AnyFunction,
  errorClass?: Class<ERR>,
): string {
  const err = _expectedError<ERR>(fn, errorClass)
  return _stringifyAny(err)
}
