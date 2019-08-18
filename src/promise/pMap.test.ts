import { inRange, randomInt, timeSpan } from '../test/test.util'
import { AggregatedError } from './aggregatedError'
import { pBatch } from './pBatch'
import { pDelay } from './pDelay'
import { pMap, PMapMapper } from './pMap'

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

const mapper: PMapMapper = ([val, ms]) => {
  if (typeof val === 'function') return val()
  return pDelay(ms, val)
}

test('main', async () => {
  const end = timeSpan()
  expect(await pMap(input, mapper)).toEqual([10, 20, 30])
  expect(inRange(end(), 290, 430)).toBe(true)
})

test('concurrency: 1', async () => {
  const end = timeSpan()
  expect(await pMap(input, mapper, { concurrency: 1 })).toEqual([10, 20, 30])
  expect(inRange(end(), 590, 760)).toBe(true)
})

test('concurrency: 4', async () => {
  const concurrency = 4
  let running = 0

  await pMap(
    new Array(100).fill(0),
    async () => {
      running++
      expect(running <= concurrency).toBe(true)
      await pDelay(randomInt(30, 200))
      running--
    },
    { concurrency },
  )
})

test('handles empty iterable', async () => {
  expect(await pMap([], mapper)).toEqual([])
})

test('async with concurrency: 2 (random time sequence)', async () => {
  const input = new Array(10).map(() => randomInt(0, 100))
  const mapper: PMapMapper = value => pDelay(value).then(() => value)
  const result = await pMap(input, mapper, { concurrency: 2 })
  expect(result).toEqual(input)
})

test('async with concurrency: 2 (problematic time sequence)', async () => {
  const input = [100, 200, 10, 36, 13, 45]
  const mapper: PMapMapper = value => pDelay(value).then(() => value)
  const result = await pMap(input, mapper, { concurrency: 2 })
  expect(result).toEqual(input)
})

test('async with concurrency: 2 (out of order time sequence)', async () => {
  const input = [200, 100, 50]
  const mapper: PMapMapper = value => pDelay(value).then(() => value)
  const result = await pMap(input, mapper, { concurrency: 2 })
  expect(result).toEqual(input)
})

test('enforce number in options.concurrency', async () => {
  await expect(pMap([], () => {}, { concurrency: 0 })).rejects.toThrow(TypeError)
  await expect(pMap([], () => {}, { concurrency: undefined })).rejects.toThrow(TypeError)
  await expect(pMap([], 2 as any)).rejects.toThrow(TypeError)
  await expect(pMap([], () => {}, { concurrency: 1 })).resolves
})

test('reject', async () => {
  const input = [1, 1, 0, 1]
  const mapper: PMapMapper = async v => {
    await pDelay(randomInt(0, 100))
    if (!v) throw new Error('Err')
    return v
  }
  await expect(pMap(input, mapper, { concurrency: 1 })).rejects.toThrow('Err')
})

test('immediately rejects when stopOnError is true', async () => {
  await expect(pMap(errorInput1, mapper, { concurrency: 1 })).rejects.toThrow('foo')
  await expect(pMap(errorInput2, mapper, { concurrency: 1 })).rejects.toThrow('bar')
})

test('aggregate errors when stopOnError is false', async () => {
  // should not throw
  await pMap(input, mapper, { concurrency: 1, stopOnError: false })

  await expect(pMap(errorInput1, mapper, { concurrency: 1, stopOnError: false })).rejects.toThrow(
    new AggregatedError(['foo', 'bar']),
  )
  await expect(pMap(errorInput2, mapper, { concurrency: 1, stopOnError: false })).rejects.toThrow(
    new AggregatedError(['bar', 'foo']),
  )

  let err: AggregatedError
  await pMap(errorInput1, mapper, { concurrency: 1, stopOnError: false }).catch(
    _err => (err = _err),
  )
  expect(err!.results).toEqual([20, 30])
  expect(err!.errors).toEqual([new Error('foo'), new Error('bar')])
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
