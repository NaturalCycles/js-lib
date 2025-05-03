import type { Readable } from 'node:stream'
import { Writable } from 'node:stream'
import type { WritableTyped } from '../stream.model.js'

/**
 * Allows to stop the Readable stream after the pipeline has processed X number of rows.
 * It counts OUTPUT rows (not input), because this Writable is always at the end of the Pipeline.
 * It ensures that everything has been processed before issuing a STOP on the readable.
 */
export function writableLimit<T>(readable: Readable, limit: number): WritableTyped<T> {
  let i = 0

  return new Writable({
    objectMode: true,
    write(_chunk, _, cb) {
      if (limit === 0) return cb() // no limit, just passthrough

      i++

      if (i === limit) {
        console.log(`writableLimit of ${limit} reached`)
        readable.destroy()
        cb() // do we need it?
      } else {
        cb() // passthrough
      }
    },
  })
}
