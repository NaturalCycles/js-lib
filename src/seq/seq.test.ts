import { _seq, Seq } from './seq'

const isEven = (n: number) => n % 2 === 0
const isOdd = (n: number) => n % 2 !== 0

test('_seq', () => {
  const v = _seq(1, n => n + 1).find(n => n % 10 === 0)
  expect(v).toBe(10)
  // console.log(v)

  // this tests Iterable interface
  expect([...Seq.range(1, 4)]).toEqual([1, 2, 3])

  expect(Seq.from([1, 2, 3]).toArray()).toEqual([1, 2, 3])

  expect(Seq.from([1, 2, 3]).some(isEven)).toBe(true)
  expect(Seq.from([1, 2, 3]).some(isOdd)).toBe(true)
  expect(Seq.from([1, 2, 3]).every(isEven)).toBe(false)
  expect(Seq.from([1, 2, 3]).every(isOdd)).toBe(false)
  expect(Seq.from([2, 4, 6]).every(isEven)).toBe(true)
})
