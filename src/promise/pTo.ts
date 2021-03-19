/**
 *
 * Wraps async calls in try catch blocks
 * to simplify syntax.
 *
 * source: https://github.com/scopsy/await-to-js/blob/master/src/await-to-js.ts
 *
 * @param { Promise } promise
 * @param { Object= } errorExt - Additional Information you can pass to the err object
 * @return { Promise } Tuple with error or response
 */
 export async function pTo<T, U = Error>(
    promise: Promise<T>,
    errorExt?: object,
  ): Promise<[U, undefined] | [null, T]> {
    return promise
      .then<[null, T]>((data: T) => [null, data])
      .catch<[U, undefined]>((err: U) => {
        if (errorExt) {
          Object.assign(err, errorExt)
        }
  
        return [err, undefined]
      })
  }
  