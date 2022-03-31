import { dayjs } from '@naturalcycles/time-lib'
import { _range } from '../array/range'
import { localDate, LocalDate } from './localDate'

test('basic', () => {
  const str = '1984-06-21'
  const ld = LocalDate.of(str)
  expect(ld.toString()).toBe(str)
  expect(String(ld)).toBe(str)
  expect(JSON.stringify(ld)).toBe(`"${str}"`)
  expect(JSON.parse(JSON.stringify(ld))).toBe(str)
  expect(ld.absDiff(str, 'day')).toBe(0)
  expect(ld.clone().isSame(ld)).toBe(true)

  expect(ld.toLocalTime().toISODateTime()).toBe('1984-06-21T00:00:00')
  expect(ld.toLocalTime().toLocalDate().isSame(ld)).toBe(true)
})

test('isBetween', () => {
  const ld = LocalDate.of('1984-06-21')
  expect(ld.isBetween('1984-06-21', '1984-06-21')).toBe(false)
  expect(ld.isBetween('1984-06-21', '1984-06-21', '()')).toBe(false)
  expect(ld.isBetween('1984-06-21', '1984-06-21', '[)')).toBe(false)
  expect(ld.isBetween('1984-06-21', '1984-06-21', '(]')).toBe(false)
  expect(ld.isBetween('1984-06-21', '1984-06-21', '[]')).toBe(true)

  expect(ld.isBetween('1984-06-21', '1984-06-22')).toBe(true)
  expect(ld.isBetween('1984-06-21', '1984-06-22', '()')).toBe(false)
  expect(ld.isBetween('1984-06-21', '1984-06-22', '[)')).toBe(true)
  expect(ld.isBetween('1984-06-21', '1984-06-22', '(]')).toBe(false)
  expect(ld.isBetween('1984-06-21', '1984-06-22', '[]')).toBe(true)

  expect(ld.isBetween('1984-06-20', '1984-06-22')).toBe(true)

  // invalid, max < min
  expect(ld.isBetween('1984-06-22', '1984-06-20')).toBe(false)
})

test('sort', () => {
  const items = ['2022-01-03', '2022-01-01', '2022-01-02'].map(s => LocalDate.of(s))

  expect(LocalDate.sort(items).map(s => s.toString())).toEqual([
    '2022-01-01',
    '2022-01-02',
    '2022-01-03',
  ])

  expect(LocalDate.earliest(items).toString()).toBe('2022-01-01')
  expect(LocalDate.latest(items).toString()).toBe('2022-01-03')
})

test('add', () => {
  const start = '2022-01-01'
  const ld = localDate(start)
  const d = dayjs(start)

  expect(ld.clone().add(1, 'day', true).toString()).toBe('2022-01-02')
  expect(ld.add(-1, 'day').toString()).toBe('2021-12-31')
  expect(ld.subtract(1, 'day').toString()).toBe('2021-12-31')
  expect(ld.add(-1, 'month').toString()).toBe('2021-12-01')

  // units.forEach(unit => {
  //   _range(1000).forEach(i => {
  //     expect(ld.add(i, unit).toString()).toBe(d.add(i, unit).toISODate())
  //   })
  // })

  _range(1000).forEach(i => {
    expect(ld.add(i, 'month').toString()).toBe(d.add(i, 'month').toISODate())
  })

  _range(1000).forEach(i => {
    expect(ld.add(i, 'year').toString()).toBe(d.add(i, 'y').toISODate())
  })
})

test('diff', () => {
  const start = '2022-01-01'
  const ld = LocalDate.of(start)
  const d = dayjs(start)

  _range(10_000).forEach(i => {
    expect(ld.add(i, 'day').diff(ld, 'year')).toBe(d.add(i, 'd').diff(d, 'y'))
    expect(ld.diff(ld.add(i, 'day'), 'year')).toBe(d.diff(d.add(i, 'd'), 'y'))

    expect(ld.add(i, 'day').diff(ld, 'month')).toBe(d.add(i, 'd').diff(d, 'month'))
    expect(ld.diff(ld.add(i, 'day'), 'month')).toBe(d.diff(d.add(i, 'd'), 'month'))

    expect(ld.add(i, 'day').diff(ld, 'day')).toBe(d.add(i, 'd').diff(d, 'd'))
    expect(ld.diff(ld.add(i, 'day'), 'day')).toBe(d.diff(d.add(i, 'd'), 'd'))
  })
})

test('validate', () => {
  // valid
  expect(LocalDate.of('2022-01-01').toString()).toBe('2022-01-01')
  expect(LocalDate.of('2022-01-01T22:01:01').toString()).toBe('2022-01-01')
  expect(LocalDate.of('2022-01-01T22:01:01Z').toString()).toBe('2022-01-01')
  expect(LocalDate.of('2022-01-01T22:01:01+2').toString()).toBe('2022-01-01')
  expect(LocalDate.of('2022-01-01nahuy').toString()).toBe('2022-01-01')
  expect(LocalDate.of('2022-1-1').toString()).toBe('2022-01-01')

  expect(() => LocalDate.of(undefined as any)).toThrow()
  expect(() => LocalDate.of(5 as any)).toThrow()
  expect(() => LocalDate.of('')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse \\"\\" into LocalDate"`,
  )
  expect(() => LocalDate.of('2022-01-')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse \\"2022-01-\\" into LocalDate"`,
  )
  expect(() => LocalDate.of('2022-01-x1')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse \\"2022-01-x1\\" into LocalDate"`,
  )

  expect(LocalDate.isValid('2022-01-01')).toBe(true)
  expect(LocalDate.isValid('2022-01-32')).toBe(false)
  expect(LocalDate.isValid('abcd')).toBe(false)
})

test('toDate', () => {
  const str = '2022-03-06'
  const d = LocalDate.of(str)
  expect(d.toDate()).toMatchInlineSnapshot(`2022-03-06T00:00:00.000Z`)
  const d2 = LocalDate.fromDate(d.toDate())
  expect(d2.toString()).toBe(str)
  expect(d2.isSame(d)).toBe(true)
  expect(d2.cmp(d)).toBe(0)
  expect(d2.isAfter(d)).toBe(false)
  expect(d2.isBefore(d)).toBe(false)
  expect(d2.isSameOrAfter(d)).toBe(true)
  expect(d2.isSameOrBefore(d)).toBe(true)
})

test('range', () => {
  expect(LocalDate.range('2021-12-24', '2021-12-26')).toMatchInlineSnapshot(`
    Array [
      "2021-12-24",
      "2021-12-25",
    ]
  `)

  expect(LocalDate.rangeInclString('2021-12-24', '2021-12-26')).toMatchInlineSnapshot(`
    Array [
      "2021-12-24",
      "2021-12-25",
      "2021-12-26",
    ]
  `)

  expect(LocalDate.rangeString('2021-12-24', '2021-12-30', 2)).toMatchInlineSnapshot(`
    Array [
      "2021-12-24",
      "2021-12-26",
      "2021-12-28",
    ]
  `)

  expect(LocalDate.rangeInclString('2021-12-24', '2021-12-30', 2)).toMatchInlineSnapshot(`
    Array [
      "2021-12-24",
      "2021-12-26",
      "2021-12-28",
      "2021-12-30",
    ]
  `)
})
