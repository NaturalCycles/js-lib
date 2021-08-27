/**
 * Calls a function, returns a Tuple of [error, value].
 * Allows to write shorter code that avoids `try/catch`.
 * Useful e.g. in unit tests.
 *
 * Similar to pTuple, but for sync functions.
 *
 * @example
 *
 * const [err, v] = _try(() => someFunction())
 */
export function _try<ERR = unknown, RETURN = void>(
  fn: () => RETURN,
): [err: ERR | undefined, value: RETURN | undefined] {
  try {
    return [undefined, fn()]
  } catch (err) {
    return [err as ERR, undefined]
  }
}
