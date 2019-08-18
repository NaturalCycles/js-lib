import { AggregatedError } from './aggregatedError'
import { pMap, PMapMapper } from './pMap'

export interface PBatchResult<T> {
  /**
   * Array of successful executions.
   */
  results: T[]

  /**
   * Returns empty array in case of 0 errors.
   */
  errors: Error[]
}

/**
 * Like pMap, but doesn't fail on errors, instead returns both successful results and errors.
 */
export async function pBatch<IN, OUT> (
  iterable: Iterable<IN | PromiseLike<IN>>,
  mapper: PMapMapper<IN, OUT>,
  options?: { concurrency?: number },
): Promise<PBatchResult<OUT>> {
  try {
    const results = await pMap(iterable, mapper, { ...options, stopOnError: false })
    return {
      results,
      errors: [],
    }
  } catch (err) {
    const { errors, results } = err as AggregatedError<OUT>
    if (!errors || !results) throw err // not an AggregatedError

    return {
      results,
      errors,
    }
  }
}
