/*
Taken from https://github.com/sindresorhus/p-map

Improvements:
- Exported as { pMap }, so IDE auto-completion works
- Included Typescript typings (no need for @types/p-map)
- Compatible with pProps (that had typings issues)
 */

import type { AbortableAsyncMapper, CommonLogger } from '..'
import { END, ErrorMode, SKIP } from '..'

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
   * When in SUPPRESS - errors are still logged via the `logger` (which defaults to console).
   */
  errorMode?: ErrorMode

  /**
   * Default to `console`.
   * Pass `null` to skip logging completely.
   */
  logger?: CommonLogger | null
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
  iterable: Iterable<IN>,
  mapper: AbortableAsyncMapper<IN, OUT>,
  opt: PMapOptions = {},
): Promise<OUT[]> {
  const { logger = console } = opt
  const ret: (OUT | typeof SKIP)[] = []
  // const iterator = iterable[Symbol.iterator]()
  const items = [...iterable]
  const itemsLength = items.length
  if (itemsLength === 0) return [] // short circuit

  const { concurrency = itemsLength, errorMode = ErrorMode.THROW_IMMEDIATELY } = opt

  const errors: Error[] = []
  let isSettled = false
  let resolvingCount = 0
  let currentIndex = 0

  // Special cases that are able to preserve async stack traces

  if (concurrency === 1) {
    // Special case for concurrency == 1

    for (const item of items) {
      try {
        const r = await mapper(item, currentIndex++)
        if (r === END) break
        if (r !== SKIP) ret.push(r)
      } catch (err) {
        if (errorMode === ErrorMode.THROW_IMMEDIATELY) throw err
        if (errorMode === ErrorMode.THROW_AGGREGATED) {
          errors.push(err as Error)
        } else {
          // otherwise, suppress (but still log via logger)
          logger?.error(err)
        }
      }
    }

    if (errors.length) {
      throw new AggregateError(errors, `pMap resulted in ${errors.length} error(s)`)
    }

    return ret as OUT[]
  } else if (!opt.concurrency || items.length <= opt.concurrency) {
    // Special case for concurrency == infinity or iterable.length < concurrency

    if (errorMode === ErrorMode.THROW_IMMEDIATELY) {
      return (await Promise.all(items.map((item, i) => mapper(item, i)))).filter(
        r => r !== SKIP && r !== END,
      ) as OUT[]
    }

    ;(await Promise.allSettled(items.map((item, i) => mapper(item, i)))).forEach(r => {
      if (r.status === 'fulfilled') {
        if (r.value !== SKIP && r.value !== END) ret.push(r.value)
      } else if (errorMode === ErrorMode.THROW_AGGREGATED) {
        errors.push(r.reason)
      } else {
        // otherwise, suppress (but still log via logger)
        logger?.error(r.reason)
      }
    })

    if (errors.length) {
      throw new AggregateError(errors, `pMap resulted in ${errors.length} error(s)`)
    }

    return ret as OUT[]
  }

  return await new Promise<OUT[]>((resolve, reject) => {
    const next = (): void => {
      if (isSettled) {
        return
      }

      const nextItem = items[currentIndex]!
      const i = currentIndex++

      if (currentIndex > itemsLength) {
        if (resolvingCount === 0) {
          isSettled = true
          const r = ret.filter(r => r !== SKIP) as OUT[]
          if (errors.length) {
            reject(new AggregateError(errors, `pMap resulted in ${errors.length} error(s)`))
          } else {
            resolve(r)
          }
        }

        return
      }

      resolvingCount++

      Promise.resolve(nextItem)
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
              if (errorMode === ErrorMode.THROW_AGGREGATED) {
                errors.push(err)
              } else {
                // otherwise, suppress (but still log via logger)
                logger?.error(err)
              }
              resolvingCount--
              next()
            }
          },
        )
    }

    for (let i = 0; i < concurrency; i++) {
      next()

      if (isSettled) {
        break
      }
    }
  })
}
