import { dayjs } from '@naturalcycles/time-lib'
import { _range } from '../array/range'
import { expectWithMessage } from '../test/test.util'
import type { LocalDateFormatter, LocalDateUnit } from './localDate'
import { localDate, LocalDate } from './localDate'

const units: LocalDateUnit[] = ['year', 'month', 'day', 'week']

const UNIT_RANGE: Record<LocalDateUnit, number> = {
  year: 1000,
  month: 100,
  week: 1000,
  day: 5000,
}

test('basic', () => {
  const str = '1984-06-21'
  const ld = LocalDate.of(str)
  expect(ld.toString()).toBe(str)
  expect(String(ld)).toBe(str)
  expect(ld.day()).toBe(21)
  expect(ld.month()).toBe(6)
  expect(ld.year()).toBe(1984)
  expect(JSON.stringify(ld)).toBe(`"${str}"`)
  expect(JSON.parse(JSON.stringify(ld))).toBe(str)
  expect(ld.absDiff(str, 'day')).toBe(0)
  expect(ld.clone().isSame(ld)).toBe(true)

  expect(ld.toLocalTime().toISODateTime()).toBe('1984-06-21T00:00:00')
  expect(ld.toLocalTime().toLocalDate().isSame(ld)).toBe(true)

  expect(ld.startOf('year').toString()).toBe('1984-01-01')
  expect(ld.startOf('month').toString()).toBe('1984-06-01')
  expect(ld.startOf('day').toString()).toBe('1984-06-21')
  expect(ld.endOf('year').toString()).toBe('1984-12-31')
  expect(ld.endOf('month').toString()).toBe('1984-06-30')
  expect(ld.endOf('day').toString()).toBe('1984-06-21')
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
  const items = ['2022-01-03', '2022-01-01', '2022-01-02'].map(i => localDate(i))

  expect(LocalDate.sort(items).map(s => s.toString())).toEqual([
    '2022-01-01',
    '2022-01-02',
    '2022-01-03',
  ])

  expect(LocalDate.earliest(items).toString()).toBe('2022-01-01')
  expect(LocalDate.latest(items).toString()).toBe('2022-01-03')
})

test('add basic', () => {
  const ld = localDate('2022-01-01')

  expect(ld.clone().add(1, 'day', true).toString()).toBe('2022-01-02')
  expect(ld.add(-1, 'day').toString()).toBe('2021-12-31')
  expect(ld.subtract(1, 'day').toString()).toBe('2021-12-31')
  expect(ld.add(-1, 'month').toString()).toBe('2021-12-01')

  const d = localDate('2022-05-31')
  expect(d.add(1, 'month').toISODate()).toBe('2022-06-30')
  expect(d.add(-1, 'month').toISODate()).toBe('2022-04-30')
})

test('add', () => {
  const starts = ['2022-05-31', '2022-05-30', '2020-02-29', '2021-02-28', '2022-01-01']

  starts.forEach(start => {
    const ld = localDate(start)
    const d = dayjs(start)

    units.forEach(unit =>
      _range(UNIT_RANGE[unit]).forEach(i => {
        let expected = d.add(i, unit).toISODate()
        let actual = ld.add(i, unit).toString()

        expectWithMessage(`${ld} + ${i} ${unit}`, expected, actual)

        actual = ld.add(-i, unit).toString()
        expected = d.add(-i, unit).toISODate()

        expectWithMessage(`${ld} - ${i} ${unit}`, expected, actual)
      }),
    )
  })
})

test('diff', () => {
  const starts = ['2022-05-31', '2022-05-30', '2020-02-29', '2021-02-28', '2022-01-01']

  starts.forEach(start => {
    const ld = LocalDate.of(start)
    const d = dayjs(start)

    units.forEach(unitAdd => {
      _range(UNIT_RANGE[unitAdd]).forEach(i => {
        units.forEach(unit => {
          let left = ld.add(i, unitAdd)
          let right = ld
          let actual = left.diff(right, unit)
          let expected = d.add(i, unitAdd).diff(d, unit)
          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)

          left = ld
          right = ld.add(i, unitAdd)
          actual = left.diff(right, unit)
          expected = d.diff(d.add(i, unitAdd), unit)
          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)

          left = ld.add(-i, unitAdd)
          right = ld
          actual = left.diff(right, unit)
          expected = d.add(-i, unitAdd).diff(d, unit)
          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)

          left = ld.add(i, unitAdd).add(40, 'day')
          right = ld
          actual = left.diff(right, unit)
          expected = d.add(i, unitAdd).add(40, 'day').diff(d, unit)
          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)
        })
      })
    })
  })
})

test('validate', () => {
  // valid
  expect(LocalDate.of('2022-01-01').toString()).toBe('2022-01-01')
  expect(LocalDate.of('2022-01-01T22:01:01').toString()).toBe('2022-01-01')
  expect(LocalDate.of('2022-01-01T22:01:01Z').toString()).toBe('2022-01-01')
  expect(LocalDate.of('2022-01-01T22:01:01+2').toString()).toBe('2022-01-01')
  expect(LocalDate.of('2022-01-01nahuy').toString()).toBe('2022-01-01')
  // expect(LocalDate.of('2022-1-1').toString()).toBe('2022-01-01') // it's strict now!

  expect(() => LocalDate.of(undefined as any)).toThrow()
  expect(() => LocalDate.of(5 as any)).toThrow()
  expect(() => LocalDate.of('')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "" into LocalDate"`,
  )
  expect(() => LocalDate.of('2022-01-')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "2022-01-" into LocalDate"`,
  )
  expect(() => LocalDate.of('2022-01-x1')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "2022-01-x1" into LocalDate"`,
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
    [
      "2021-12-24",
      "2021-12-25",
    ]
  `)

  expect(LocalDate.range('2021-12-24', '2021-12-26', '[]')).toMatchInlineSnapshot(`
    [
      "2021-12-24",
      "2021-12-25",
      "2021-12-26",
    ]
  `)

  expect(LocalDate.range('2021-12-24', '2021-12-30', '[)', 2)).toMatchInlineSnapshot(`
    [
      "2021-12-24",
      "2021-12-26",
      "2021-12-28",
    ]
  `)

  expect(LocalDate.range('2021-12-24', '2021-12-30', '[]', 2)).toMatchInlineSnapshot(`
    [
      "2021-12-24",
      "2021-12-26",
      "2021-12-28",
      "2021-12-30",
    ]
  `)
})

test('format', () => {
  const fmt: LocalDateFormatter = ld => `${ld.year()}-${String(ld.month()).padStart(2, '0')}`
  expect(localDate('1984-06-21').format(fmt)).toBe('1984-06')

  const fmt2: LocalDateFormatter = ld => `${String(ld.month()).padStart(2, '0')}/${ld.year()}`
  expect(localDate('1984-06-21').format(fmt2)).toBe('06/1984')

  const fmt3 = new Intl.DateTimeFormat('ru', {
    month: 'long',
    day: 'numeric',
  })
  expect(localDate('1984-06-21').format(fmt3)).toBe('21 июня')
})

test('diff2', () => {
  expect(localDate('2020-03-03').diff('1991-06-21', 'year')).toBe(28)

  const ld = localDate('2022-01-01')
  expect(ld.diff('2020-12-31', 'year')).toBe(1)
  expect(ld.diff('2021-01-01', 'year')).toBe(1)
  expect(ld.diff('2021-01-02', 'year')).toBe(0)

  // day 2022-01-01 2020-12-01
  expect(localDate('2020-12-01').diff(ld, 'day')).toBe(-396)
  expect(ld.diff('2020-12-01', 'day')).toBe(396)

  expect(localDate('2020-02-29').diff('2020-01-30', 'month')).toBe(
    dayjs('2020-02-29').diff('2020-01-30', 'month'),
  )

  expect(localDate('2020-01-30').diff('2020-02-29', 'month')).toBe(
    dayjs('2020-01-30').diff('2020-02-29', 'month'),
  )
})
