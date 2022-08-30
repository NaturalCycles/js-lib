import { DateInterval } from './dateInterval'
import { LocalDate } from './localDate'

/* eslint-disable jest/prefer-to-contain */

test('basic', () => {
  const str1 = '2022-02-24/2022-03-30'
  const int1 = DateInterval.parse(str1)
  expect(int1.toString()).toBe(str1)
  expect(JSON.stringify(int1)).toBe(`"${str1}"`)
  expect(int1.start.isSame('2022-02-24'))
  expect(int1.end.isSame('2022-03-30'))

  const int2 = DateInterval.of('2022-02-24', '2022-03-30')
  const int3 = DateInterval.of(LocalDate.of('2022-02-24'), LocalDate.of('2022-03-30'))

  expect(int1.isSame(int2)).toBe(true)
  expect(int1.cmp(int2)).toBe(0)
  expect(int1.isSameOrAfter(int2)).toBe(true)
  expect(int1.isSameOrBefore(int2)).toBe(true)
  expect(int1.isAfter(int2)).toBe(false)
  expect(int1.isBefore(int2)).toBe(false)
  expect(int1.isSame(int3)).toBe(true)

  expect(() => DateInterval.parse('')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "" into DateInterval"`,
  )
  expect(() => DateInterval.parse('abcd')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "abcd" into DateInterval"`,
  )
  expect(() => DateInterval.parse('2022-02-24')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "2022-02-24" into DateInterval"`,
  )
  expect(() => DateInterval.parse('2022-02-24/abcd')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "abcd" into LocalDate"`,
  )
})

test('includes', () => {
  const int = DateInterval.parse('2022-02-24/2022-03-30')
  expect(int.includes('2022-02-23')).toBe(false)
  expect(int.includes('2022-02-24')).toBe(true)
  expect(int.includes('2022-02-25')).toBe(true)
  expect(int.includes('2022-02-28')).toBe(true)
  expect(int.includes('2022-03-01')).toBe(true)
  expect(int.includes('2022-03-11')).toBe(true)
  expect(int.includes('2022-03-29')).toBe(true)
  expect(int.includes('2022-03-30')).toBe(true)
  expect(int.includes('2022-03-31')).toBe(false)
  expect(int.includes('2022-04-01')).toBe(false)
})

test('getDays', () => {
  const int = DateInterval.parse('2022-02-24/2022-03-01')
  expect(int.getDays()).toMatchInlineSnapshot(`
    [
      "2022-02-24",
      "2022-02-25",
      "2022-02-26",
      "2022-02-27",
      "2022-02-28",
      "2022-03-01",
    ]
  `)
})

test('intersects', () => {
  const int = DateInterval.parse('2022-03-01/2022-03-31')
  expect(int.intersects('2022-03-01/2022-03-31')).toBe(true)
  expect(int.intersects('2022-03-02/2022-03-31')).toBe(true)
  expect(int.intersects('2022-03-02/2022-03-30')).toBe(true)
  expect(int.intersects('2022-03-02/2022-04-30')).toBe(true)
  expect(int.intersects('2022-03-02/2022-03-02')).toBe(true)
  expect(int.intersects('2022-02-02/2022-03-01')).toBe(true)
  expect(int.intersects('2022-02-02/2022-02-03')).toBe(false)
  expect(int.intersects('2022-02-02/2022-02-28')).toBe(false)
  expect(int.intersects('2022-04-01/2022-04-02')).toBe(false)
})
