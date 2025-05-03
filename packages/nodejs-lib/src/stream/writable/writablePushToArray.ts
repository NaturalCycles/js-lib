import { Writable } from 'node:stream'
import type { TransformOptions, WritableTyped } from '../stream.model.js'

/**
 * Will push all results to `arr`, will emit nothing in the end.
 */
export function writablePushToArray<IN>(arr: IN[], opt: TransformOptions = {}): WritableTyped<IN> {
  return new Writable({
    objectMode: true,
    ...opt,
    write(chunk: IN, _, cb) {
      arr.push(chunk)
      // callback to signal that we processed input, but not emitting any output
      cb()
    },
  })
}
