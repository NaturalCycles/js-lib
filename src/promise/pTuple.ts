/**
 * Wraps async calls in try catch blocks
 * to simplify syntax.
 *
 * source: https://github.com/scopsy/await-to-js/blob/master/src/await-to-js.ts
 */
export async function pTuple<RETURN, ERR = Error>(
  promise: Promise<RETURN>,
): Promise<[ERR, undefined] | [null, RETURN]> {
  return promise.then(data => [null, data] as [null, RETURN]).catch(err => [err as ERR, undefined])
}
