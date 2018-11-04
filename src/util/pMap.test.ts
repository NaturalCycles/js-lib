import { pMap, PMapMapper } from './pMap'
import { promiseSharedUtil } from './promise.shared.util'
import { randomSharedUtil } from './random.shared.util'

function inRange (x: number, start: number, end: number): boolean {
  if (end === undefined) {
    end = start
    start = 0
  }

  return x >= Math.min(start, end) && x <= Math.max(end, start)
}

function convertHrtime (hrtime: [number, number]) {
  const nanoseconds = hrtime[0] * 1e9 + hrtime[1]
  const milliseconds = nanoseconds / 1e6
  const seconds = nanoseconds / 1e9

  return {
    seconds,
    milliseconds,
    nanoseconds,
  }
}

function timeSpan (): () => number {
  const start = process.hrtime()
  const end = (type: string) => convertHrtime(process.hrtime(start))[type]

  const ret = () => end('milliseconds')
  ret.rounded = () => Math.round(end('milliseconds'))
  ret.seconds = () => end('seconds')
  ret.nanoseconds = () => end('nanoseconds')

  return ret
}

const delay = promiseSharedUtil.delay
const m = pMap

const input = [Promise.resolve([10, 300]), [20, 200], [30, 100]]

const mapper: PMapMapper = ([val, ms]) => delay(ms).then(() => val)

test('main', async () => {
  const end = timeSpan()
  expect(await m(input, mapper)).toEqual([10, 20, 30])
  expect(inRange(end(), 290, 430)).toBe(true)
})

test('concurrency: 1', async () => {
  const end = timeSpan()
  expect(await m(input, mapper, { concurrency: 1 })).toEqual([10, 20, 30])
  expect(inRange(end(), 590, 760)).toBe(true)
})

test('concurrency: 4', async () => {
  const concurrency = 4
  let running = 0

  await m(
    new Array(100).fill(0),
    async () => {
      running++
      expect(running <= concurrency).toBe(true)
      await delay(randomSharedUtil.randomInt(30, 200))
      running--
    },
    { concurrency },
  )
})

test('handles empty iterable', async () => {
  expect(await m([], mapper)).toEqual([])
})

test('async with concurrency: 2 (random time sequence)', async () => {
  const input = new Array(10).map(() => randomSharedUtil.randomInt(0, 100))
  const mapper: PMapMapper = value => delay(value).then(() => value)
  const result = await m(input, mapper, { concurrency: 2 })
  expect(result).toEqual(input)
})

test('async with concurrency: 2 (problematic time sequence)', async () => {
  const input = [100, 200, 10, 36, 13, 45]
  const mapper: PMapMapper = value => delay(value).then(() => value)
  const result = await m(input, mapper, { concurrency: 2 })
  expect(result).toEqual(input)
})

test('async with concurrency: 2 (out of order time sequence)', async () => {
  const input = [200, 100, 50]
  const mapper: PMapMapper = value => delay(value).then(() => value)
  const result = await m(input, mapper, { concurrency: 2 })
  expect(result).toEqual(input)
})

test('enforce number in options.concurrency', async () => {
  await expect(m([], () => {}, { concurrency: 0 })).rejects.toThrow(TypeError)
  await expect(m([], () => {}, { concurrency: undefined })).rejects.toThrow(TypeError)
  await expect(m([], 2 as any)).rejects.toThrow(TypeError)
  await expect(m([], () => {}, { concurrency: 1 })).resolves
})

test('reject', async () => {
  const input = [1, 1, 0, 1]
  const mapper: PMapMapper = async v => {
    await promiseSharedUtil.delay(randomSharedUtil.randomInt(0, 100))
    if (!v) throw new Error('Err')
    return v
  }
  await expect(m(input, mapper, { concurrency: 1 })).rejects.toThrow('Err')
})
