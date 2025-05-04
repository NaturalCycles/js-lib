import { Transform } from 'node:stream'
import { _pipeline } from '../pipeline/pipeline.js'
import { readableCreate } from '../readable/readableCreate.js'
import type { TransformTyped } from '../stream.model.js'

type AnyStream = NodeJS.WritableStream | NodeJS.ReadWriteStream

/**
 * Allows to "tee"/"fork" away from the "main pipeline" into the "secondary pipeline".
 *
 * Important, that the main pipeline works "as normal", keeps backpressure, etc.
 * Secondary pipeline DOES NOT keep backpressure.
 * Therefor, the "slowest" pipeline should be made Primary (to keep backpressure).
 *
 * @experimental
 */
export function transformTee<T>(streams: AnyStream[]): TransformTyped<T, T> {
  const readable = readableCreate<T>()

  const secondPipelinePromise = _pipeline([readable, ...streams])

  return new Transform({
    objectMode: true,
    transform(chunk: T, _, cb) {
      // pass to the "secondary" pipeline
      readable.push(chunk)

      // pass through to the "main" pipeline
      cb(null, chunk)
    },
    async final(cb) {
      console.log('transformTee final')

      // Pushing null "closes"/ends the secondary pipeline correctly
      readable.push(null)

      // Second pipeline is expected to finish now, let's await it
      await secondPipelinePromise
      console.log('transformTee final secondPipeline done')

      // Because second pipeline is done - now we can signal main pipeline to be done as well
      cb()
    },
  })
}
