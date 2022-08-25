import type { AsyncMapper } from '..'
import { _inRange, _randomInt, _range, AppError, END, ErrorMode, pExpectedError, SKIP } from '..'
import { timeSpan } from '../test/test.util'
import type { AggregatedError } from './AggregatedError'
import { pDelay } from './pDelay'
import { pMap } from './pMap'

const input = [
  [10, 300],
  [20, 200],
  [30, 100],
]
const fastInput = [
  [10, 30],
  [20, 20],
  [30, 10],
]

const errorInput1 = [
  [20, 20],
  [30, 10],
  [() => Promise.reject(new Error('foo'))],
  [() => Promise.reject(new Error('bar'))],
]

const errorInput2 = [
  [20, 20],
  [() => Promise.reject(new Error('bar'))],
  [30, 10],
  [() => Promise.reject(new Error('foo'))],
]

const mapper: AsyncMapper = async ([val, ms]) => {
  if (typeof val === 'function') return val()
  return await pDelay(ms, val)
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
    _range(100).map(() => 0),
    async () => {
      running++
      expect(running <= concurrency).toBe(true)
      await pDelay(_randomInt(3, 20))
      running--
    },
    { concurrency },
  )
})

test('handles empty iterable', async () => {
  expect(await pMap([], mapper)).toEqual([])
})

test('async with concurrency: 2 (random time sequence)', async () => {
  const input = _range(10).map(() => _randomInt(0, 100))
  const result = await pMap(input, v => pDelay(v, v), { concurrency: 2 })
  expect(result).toEqual(input)
})

test('async with concurrency: 2 (problematic time sequence)', async () => {
  const input = [10, 20, 10, 36, 13, 45]
  const result = await pMap(input, v => pDelay(v, v), { concurrency: 2 })
  expect(result).toEqual(input)
})

test('async with concurrency: 2 (out of order time sequence)', async () => {
  const input = [20, 10, 50]
  const result = await pMap(input, v => pDelay(v, v), { concurrency: 2 })
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

test('immediately rejects when errorMode=THROW_IMMEDIATELY', async () => {
  await expect(
    pMap(errorInput1, mapper, { concurrency: 1 }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"foo"`)

  await expect(
    pMap(errorInput2, mapper, { concurrency: 1 }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"bar"`)

  // infinite
  await expect(pMap(errorInput1, mapper)).rejects.toThrowErrorMatchingInlineSnapshot(`"foo"`)

  // limited
  await expect(
    pMap(errorInput1, mapper, { concurrency: 3 }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"foo"`)

  // high
  await expect(
    pMap(errorInput1, mapper, { concurrency: 5 }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"foo"`)
})

test('aggregate errors when errorMode=THROW_AGGREGATED', async () => {
  const errorMode = ErrorMode.THROW_AGGREGATED

  // should not throw
  await pMap(fastInput, mapper, { concurrency: 1, errorMode })
  await pMap(fastInput, mapper, { errorMode })

  await expect(pMap(errorInput1, mapper, { concurrency: 1, errorMode })).rejects
    .toThrowErrorMatchingInlineSnapshot(`
          "2 errors:
          1. foo
          2. bar"
        `)

  await expect(pMap(errorInput2, mapper, { concurrency: 1, errorMode })).rejects
    .toThrowErrorMatchingInlineSnapshot(`
          "2 errors:
          1. bar
          2. foo"
        `)

  let err = await pExpectedError<AggregatedError>(
    pMap(errorInput1, mapper, { concurrency: 1, errorMode }),
  )
  expect(err.results).toEqual([20, 30])
  expect(err).toMatchInlineSnapshot(`
    [AggregatedError: 2 errors:
    1. foo
    2. bar]
  `)

  // infinite concurrency
  err = await pExpectedError<AggregatedError>(pMap(errorInput1, mapper, { errorMode }))
  expect(err.results).toEqual([20, 30])
  expect(err).toMatchInlineSnapshot(`
    [AggregatedError: 2 errors:
    1. foo
    2. bar]
  `)

  // limited concurrency
  err = await pExpectedError<AggregatedError>(
    pMap(errorInput1, mapper, { concurrency: 3, errorMode }),
  )
  expect(err.results).toEqual([20, 30])
  expect(err).toMatchInlineSnapshot(`
    [AggregatedError: 2 errors:
    1. foo
    2. bar]
  `)
})

test('suppress errors when errorMode=SUPPRESS', async () => {
  const errorMode = ErrorMode.SUPPRESS

  await pMap(fastInput, mapper, { concurrency: 1, errorMode })

  await pMap(errorInput1, mapper, { concurrency: 1, errorMode })
  await pMap(errorInput2, mapper, { concurrency: 1, errorMode })
})

test('SKIP', async () => {
  const values = _range(1, 4)
  const r = await pMap(values, v => (v % 2 === 0 ? SKIP : v), { concurrency: 1 })
  expect(r).toEqual([1, 3])
})

test('END', async () => {
  const values = _range(1, 10)
  let r = await pMap(values, v => (v === 3 ? END : v), { concurrency: 1 })
  expect(r).toEqual([1, 2])

  r = await pMap(values, v => (v === 3 ? END : v), { concurrency: 5 })
  expect(r).toEqual([1, 2])

  r = await pMap(values, v => (v === 3 ? END : v), { concurrency: 11 })
  // Because concurrency is 11, END cannot really stop the other values from being returned
  // (they're "in-flight")
  expect(r).toEqual([1, 2, 4, 5, 6, 7, 8, 9])
})

test('should preserve stack', async () => {
  const err = await pExpectedError(wrappingFn())

  // ok, it's tricky to make pMap to preserve the stack
  // currently it doesn't work :(
  // UPD: works for selected cases: infinite/limited/no concurrency
  // console.log(err)
  // console.log(err.stack)
  expect(err.stack).toContain('at pMap')
  expect(err.stack).toContain('at wrappingFn')
  expect(err.stack).toContain('at pExpectedError')
})

async function wrappingFn(): Promise<void> {
  await pMap([1, 2, 3], async n => await fn(n))
  // await Promise.all([1, 2, 3].map(n => fn(n)))
  // return await new Promise((resolve, reject) => {
  //   reject(new AppError('fn error'))
  // })
}

// Fails on 3
async function fn(n: number): Promise<number> {
  if (n === 3) {
    await pDelay(1)
    throw new AppError('fn error')
  }

  return n * 2
}
