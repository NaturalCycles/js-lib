import type { AbortableAsyncMapper } from '../index'
import { END } from '../index'
import { pDelay } from '../promise/pDelay'
import { _seq, AsyncSequence, Sequence } from './seq'

const isEven = (n: number): boolean => n % 2 === 0
const isOdd = (n: number): boolean => n % 2 !== 0

test('_seq', () => {
  const v = _seq(1, n => n + 1).find(n => n % 10 === 0)
  expect(v).toBe(10)
  // console.log(v)

  // this tests Iterable interface
  expect([...Sequence.range(1, 4)]).toEqual([1, 2, 3])

  expect(Sequence.from([1, 2, 3]).toArray()).toEqual([1, 2, 3])

  expect(Sequence.from([1, 2, 3]).some(isEven)).toBe(true)
  expect(Sequence.from([1, 2, 3]).some(isOdd)).toBe(true)
  expect(Sequence.from([1, 2, 3]).every(isEven)).toBe(false)
  expect(Sequence.from([1, 2, 3]).every(isOdd)).toBe(false)
  expect(Sequence.from([2, 4, 6]).every(isEven)).toBe(true)
})

test('AsyncSequence', async () => {
  // Mapper that increments a number until it reaches 10 (inclusive)
  const mapper: AbortableAsyncMapper<number, number> = async n =>
    n === 10 ? END : await pDelay(1, n + 1)

  // Find first even number
  let seq = AsyncSequence.create(1, mapper)
  expect(await seq.find(n => n % 2 === 0)).toBe(2)

  // Find first odd number (initial number)
  seq = AsyncSequence.create(1, mapper)
  expect(await seq.find(n => n % 2 === 1)).toBe(1)

  // toArray
  seq = AsyncSequence.create(1, mapper)
  expect(await seq.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
})
