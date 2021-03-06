import { AsyncMapper, ErrorMode, _inRange, _randomInt } from '..'
import { timeSpan } from '../test/test.util'
import { AggregatedError } from './AggregatedError'
import { pBatch } from './pBatch'
import { pDelay } from './pDelay'
import { pMap } from './pMap'

const input = [Promise.resolve([10, 300]), [20, 200], [30, 100]]

const errorInput1 = [
  [20, 200],
  [30, 100],
  [() => Promise.reject(new Error('foo'))],
  [() => Promise.reject(new Error('bar'))],
]

const errorInput2 = [
  [20, 200],
  [() => Promise.reject(new Error('bar'))],
  [30, 100],
  [() => Promise.reject(new Error('foo'))],
]

const errorInput3 = [
  [() => Promise.reject(new Error('one'))],
  [() => Promise.reject(new Error('two'))],
]

const mapper: AsyncMapper = ([val, ms]) => {
  if (typeof val === 'function') return val()
  return pDelay(ms, val)
}

test('main', async () => {
  const end = timeSpan()
  expect(await pMap(input, mapper)).toEqual([10, 20, 30])
  expect(_inRange(end(), 290, 430)).toBe(true)
})

test('concurrency: 1', async () => {
  const end = timeSpan()
  expect(await pMap(input, mapper, { concurrency: 1 })).toEqual([10, 20, 30])
  expect(_inRange(end(), 590, 760)).toBe(true)
})

test('concurrency: 4', async () => {
  const concurrency = 4
  let running = 0

  await pMap(
    Array.from({ length: 100 }).fill(0),
    async () => {
      running++
      expect(running <= concurrency).toBe(true)
      await pDelay(_randomInt(30, 200))
      running--
    },
    { concurrency },
  )
})

test('handles empty iterable', async () => {
  expect(await pMap([], mapper)).toEqual([])
})

test('async with concurrency: 2 (random time sequence)', async () => {
  const input = Array.from({ length: 10 }).map(() => _randomInt(0, 100))
  const mapper: AsyncMapper = value => pDelay(value).then(() => value)
  const result = await pMap(input, mapper, { concurrency: 2 })
  expect(result).toEqual(input)
})

test('async with concurrency: 2 (problematic time sequence)', async () => {
  const input = [100, 200, 10, 36, 13, 45]
  const mapper: AsyncMapper = value => pDelay(value).then(() => value)
  const result = await pMap(input, mapper, { concurrency: 2 })
  expect(result).toEqual(input)
})

test('async with concurrency: 2 (out of order time sequence)', async () => {
  const input = [200, 100, 50]
  const mapper: AsyncMapper = value => pDelay(value).then(() => value)
  const result = await pMap(input, mapper, { concurrency: 2 })
  expect(result).toEqual(input)
})

test('reject', async () => {
  const input = [1, 1, 0, 1]
  const mapper: AsyncMapper = async v => {
    await pDelay(_randomInt(0, 100))
    if (!v) throw new Error('Err')
    return v
  }
  await expect(pMap(input, mapper, { concurrency: 1 })).rejects.toThrow('Err')
})

test('immediately rejects when stopOnError is true', async () => {
  await expect(pMap(errorInput1, mapper, { concurrency: 1 })).rejects.toThrow('foo')
  await expect(pMap(errorInput2, mapper, { concurrency: 1 })).rejects.toThrow('bar')
})

test('aggregate errors when errorMode=THROW_AGGREGATED', async () => {
  const errorMode = ErrorMode.THROW_AGGREGATED

  // should not throw
  await pMap(input, mapper, { concurrency: 1, errorMode })

  await expect(pMap(errorInput1, mapper, { concurrency: 1, errorMode })).rejects.toThrow(
    new AggregatedError(['foo', 'bar']),
  )
  await expect(pMap(errorInput2, mapper, { concurrency: 1, errorMode })).rejects.toThrow(
    new AggregatedError(['bar', 'foo']),
  )

  let err: AggregatedError
  await pMap(errorInput1, mapper, { concurrency: 1, errorMode }).catch(_err => (err = _err))
  expect(err!.results).toEqual([20, 30])
  expect(err!.errors).toEqual([new Error('foo'), new Error('bar')])
})

test('suppress errors when errorMode=SUPPRESS', async () => {
  const errorMode = ErrorMode.SUPPRESS

  await pMap(input, mapper, { concurrency: 1, errorMode })

  await pMap(errorInput1, mapper, { concurrency: 1, errorMode })
  await pMap(errorInput2, mapper, { concurrency: 1, errorMode })
})

test('pBatch', async () => {
  expect(await pBatch([], mapper, { concurrency: 1 })).toEqual({
    results: [],
    errors: [],
  })

  expect(await pBatch(input, mapper, { concurrency: 1 })).toEqual({
    results: [10, 20, 30],
    errors: [],
  })

  expect(await pBatch(errorInput1, mapper, { concurrency: 1 })).toEqual({
    results: [20, 30],
    errors: [new Error('foo'), new Error('bar')],
  })

  expect(await pBatch(errorInput3, mapper, { concurrency: 1 })).toEqual({
    results: [],
    errors: [new Error('one'), new Error('two')],
  })
})
