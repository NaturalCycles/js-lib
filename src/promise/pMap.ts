/*
Taken from https://github.com/sindresorhus/p-map

Improvements:
- Exported as { pMap }, so IDE auto-completion works
- Included Typescript typings (no need for @types/p-map)
- Compatible with pProps (that had typings issues)
 */

import { AbortableAsyncMapper, END, ErrorMode, SKIP } from '..'
import { AggregatedError } from './AggregatedError'

export interface PMapOptions {
  /**
   * Number of concurrently pending promises returned by `mapper`.
   *
   * @default Infinity
   */
  concurrency?: number

  /**
   * @default ErrorMode.THROW_IMMEDIATELY
   *
   * When set to THROW_AGGREGATED, instead of stopping when a promise rejects, it will wait for all the promises to settle and then reject with an Aggregated error.
   *
   * When set to SUPPRESS - will ignore errors and return results from successful operations.
   */
  errorMode?: ErrorMode
}

/**
 * Returns a `Promise` that is fulfilled when all promises in `input` and ones returned from `mapper` are fulfilled,
 * or rejects if any of the promises reject. The fulfilled value is an `Array` of the fulfilled values returned
 * from `mapper` in `input` order.
 *
 * @param iterable - Iterated over concurrently in the `mapper` function.
 * @param mapper - Function which is called for every item in `input`. Expected to return a `Promise` or value.
 * @param opt - Options-object.
 *
 * @example
 *
 * const sites = [
 * 	'ava.li',
 * 	'todomvc.com
 * ];
 *
 * (async () => {
 * 	const mapper = async site => {
 * 		const {requestUrl} = await got.head(site);
 * 		return requestUrl;
 * 	};
 *
 * 	const result = await pMap(sites, mapper, {concurrency: 2});
 * 	//=> ['http://ava.li/', 'http://todomvc.com/']
 * })();
 */
export async function pMap<IN, OUT>(
  iterable: Iterable<IN | PromiseLike<IN>>,
  mapper: AbortableAsyncMapper<IN, OUT>,
  opt: PMapOptions = {},
): Promise<OUT[]> {
  return new Promise<OUT[]>((resolve, reject) => {
    const { concurrency = Number.POSITIVE_INFINITY, errorMode = ErrorMode.THROW_IMMEDIATELY } = opt

    const ret: (OUT | typeof SKIP)[] = []
    const iterator = iterable[Symbol.iterator]()
    const errors: Error[] = []
    let isSettled = false
    let isIterableDone = false
    let resolvingCount = 0
    let currentIndex = 0

    const next = (skipped = false) => {
      if (isSettled) {
        return
      }

      const nextItem = iterator.next()
      const i = currentIndex
      if (!skipped) currentIndex++

      if (nextItem.done) {
        isIterableDone = true

        if (resolvingCount === 0) {
          const r = ret.filter(r => r !== SKIP) as OUT[]
          if (errors.length && errorMode === ErrorMode.THROW_AGGREGATED) {
            reject(new AggregatedError(errors, r))
          } else {
            resolve(r)
          }
        }

        return
      }

      resolvingCount++

      Promise.resolve(nextItem.value)
        .then(async element => await mapper(element, i))
        .then(
          value => {
            if (value === END) {
              isSettled = true
              return resolve(ret.filter(r => r !== SKIP) as OUT[])
            }

            ret[i] = value
            resolvingCount--
            next()
          },
          err => {
            if (errorMode === ErrorMode.THROW_IMMEDIATELY) {
              isSettled = true
              reject(err)
            } else {
              errors.push(err)
              resolvingCount--
              next()
            }
          },
        )
    }

    for (let i = 0; i < concurrency; i++) {
      next()

      if (isIterableDone) {
        break
      }
    }
  })
}
