import { Transform } from 'node:stream'
import type { TransformOptions, TransformTyped } from '../stream.model.js'

/**
 * Will collect all stream results in the array (keeping it in memory) and emit in the end as one result.
 */
export function transformToArray<IN>(opt: TransformOptions = {}): TransformTyped<IN, IN[]> {
  const res: IN[] = []

  return new Transform({
    objectMode: true,
    ...opt,
    transform(chunk: IN, _, cb) {
      res.push(chunk)
      // callback to signal that we processed input, but not emitting any output
      cb()
    },
    final(this: Transform, cb) {
      this.push(res)
      cb()
    },
  })
}
