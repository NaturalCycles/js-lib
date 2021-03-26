/**
 * Wraps async calls in try catch blocks
 * to simplify syntax.
 *
 * source: https://github.com/scopsy/await-to-js/blob/master/src/await-to-js.ts
 */
export async function pTuple<T, U = Error>(
  promise: Promise<T>,
): Promise<[U, undefined] | [null, T]> {
  return promise
    .then<[null, T]>((data: T) => [null, data])
    .catch<[U, undefined]>((err: U) => {
      return [err, undefined]
    })
}
