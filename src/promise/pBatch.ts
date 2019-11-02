import { BatchResult, ErrorMode } from '..'
import { Mapper } from '../types'
import { AggregatedError } from './aggregatedError'
import { pMap } from './pMap'

/**
 * Like pMap, but doesn't fail on errors, instead returns both successful results and errors.
 */
export async function pBatch<IN, OUT>(
  iterable: Iterable<IN | PromiseLike<IN>>,
  mapper: Mapper<IN, OUT>,
  options?: { concurrency?: number },
): Promise<BatchResult<OUT>> {
  try {
    const results = await pMap(iterable, mapper, {
      ...options,
      errorMode: ErrorMode.THROW_AGGREGATED,
    })
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
