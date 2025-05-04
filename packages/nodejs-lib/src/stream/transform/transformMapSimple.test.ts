import { Readable } from 'node:stream'
import { _range, AppError, ErrorMode, pTry } from '@naturalcycles/js-lib'
import { expect, test } from 'vitest'
import { _pipeline } from '../pipeline/pipeline.js'
import { writableVoid } from '../writable/writableVoid.js'
import { transformMapSimple } from './transformMapSimple.js'

test('transformMapSimple', async () => {
  const data = _range(1, 4).map(String)
  const readable = Readable.from(data)

  const data2: string[] = []

  await _pipeline([
    readable,
    transformMapSimple<string, void>(r => void data2.push(r)),
    writableVoid(),
  ])

  expect(data2).toEqual(data)
})

test('transformMapSimple error', async () => {
  const data = _range(100).map(String)

  const data2: string[] = []
  const [err] = await pTry(
    _pipeline([
      Readable.from(data),
      transformMapSimple<string, void>((r, i) => {
        if (i === 50) {
          throw new AppError('error on 50th')
        }

        data2.push(r)
      }),
      writableVoid(),
    ]),
  )

  expect(err).toBeInstanceOf(AppError)
  expect(err).toMatchInlineSnapshot(`[AppError: error on 50th]`)

  expect(data2).toEqual(data.slice(0, 50))
})

test('transformMapSimple suppressed error', async () => {
  const data = _range(100).map(String)

  const data2: string[] = []
  await _pipeline([
    Readable.from(data),
    transformMapSimple<string, void>(
      (r, i) => {
        if (i === 50) {
          throw new AppError('error on 50th')
        }

        data2.push(r)
      },
      {
        errorMode: ErrorMode.SUPPRESS,
      },
    ),
    writableVoid(),
  ])

  expect(data2).toEqual(data.filter(r => r !== '50'))
})
