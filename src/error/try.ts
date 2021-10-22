/**
 * Calls a function, returns a Tuple of [error, value].
 * Allows to write shorter code that avoids `try/catch`.
 * Useful e.g. in unit tests.
 *
 * Similar to pTuple, but for sync functions.
 *
 * For convenience, second argument type is non-optional,
 * so you can use it without `!`. But you SHOULD always check `if (err)` first!
 *
 * @example
 *
 * const [err, v] = _try(() => someFunction())
 * if (err) ...do something...
 * v // go ahead and use v
 */
export function _try<ERR = unknown, RETURN = void>(
  fn: () => RETURN,
): [err: ERR | null, value: RETURN] {
  try {
    return [null, fn()]
  } catch (err) {
    return [err as ERR, undefined as any]
  }
}

/**
 * Like _try, but for Promises.
 *
 * Also, intentionally types second return item as non-optional,
 * but you should check for `err` presense first!
 */
export async function pTry<ERR = unknown, RETURN = void>(
  promise: Promise<RETURN>,
): Promise<[err: ERR | null, value: RETURN]> {
  try {
    return [null, await promise]
  } catch (err) {
    return [err as ERR, undefined as any]
  }
}
