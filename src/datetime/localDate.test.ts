import { dayjs } from '@naturalcycles/time-lib'
import { _range } from '../array/range'
import { expectWithMessage, isUTC } from '../test/test.util'
import { LocalDateFormatter, LocalDateUnit, localDate } from './localDate'

const units: LocalDateUnit[] = ['year', 'month', 'day', 'week']

const UNIT_RANGE: Record<LocalDateUnit, number> = {
  year: 1000,
  month: 100,
  week: 1000,
  day: 5000,
}

test('basic', () => {
  const str = '1984-06-21'
  const ld = localDate.fromInput(str)
  expect(ld.toString()).toBe(str)
  expect(ld.toStringCompact()).toBe('19840621')
  expect(String(ld)).toBe(str)
  expect(ld.day).toBe(21)
  expect(ld.month).toBe(6)
  expect(ld.year).toBe(1984)
  expect(ld.toMonthId()).toBe('1984-06')
  expect(ld.toDateObject()).toEqual({
    year: 1984,
    month: 6,
    day: 21,
  })
  expect(JSON.stringify(ld)).toBe(`"${str}"`)
  expect(JSON.parse(JSON.stringify(ld))).toBe(str)
  expect(ld.absDiff(str, 'day')).toBe(0)
  expect(ld.clone().isSame(ld)).toBe(true)

  expect(ld.toISODateTime()).toBe('1984-06-21T00:00:00')
  expect(ld.toISODateTimeInUTC()).toBe('1984-06-21T00:00:00Z')
  expect(ld.toLocalTime().toISODateTime()).toBe('1984-06-21T00:00:00')
  expect(ld.toLocalTime().toLocalDate().isSame(ld)).toBe(true)
  expect(ld.unix).toMatchInlineSnapshot(`456624000`)
  expect(ld.unixMillis).toMatchInlineSnapshot(`456624000000`)

  expect(ld.startOf('year').toString()).toBe('1984-01-01')
  expect(ld.startOf('month').toString()).toBe('1984-06-01')
  expect(ld.startOf('day').toString()).toBe('1984-06-21')
  expect(ld.endOf('year').toString()).toBe('1984-12-31')
  expect(ld.endOf('month').toString()).toBe('1984-06-30')
  expect(ld.endOf('day').toString()).toBe('1984-06-21')
  expect(ld.daysInMonth).toBe(30)
  expect(ld.setMonth(7).daysInMonth).toBe(31)
  expect(ld.setMonth(2).daysInMonth).toBe(29)

  expect(localDate.orUndefined(undefined)).toBeUndefined()
  expect(localDate.orUndefined(null)).toBeUndefined()
  expect(localDate.orUndefined(0 as any)).toBeUndefined()
  expect(localDate.orUndefined(str)?.toString()).toBe(str)

  expect(localDate.today().toISODate()).toBeDefined()
  expect(localDate.todayInUTC().toISODate()).toBeDefined()
  expect(localDate.orToday(undefined).toISODate()).toBe(localDate.today().toISODate())
  expect(localDate.orToday(ld).toISODate()).toBe(ld.toISODate())

  expect(() => localDate(undefined as any)).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "undefined" into LocalDate"`,
  )

  expect(ld.isOlderThan(5, 'day')).toBe(true)
  expect(ld.isYoungerThan(5, 'day')).toBe(false)
  expect(ld.isOlderThan(100, 'year')).toBe(false)
  expect(ld.isYoungerThan(100, 'year')).toBe(true)
  expect(ld.getAgeInYears('2024-05-15')).toBe(39)
  expect(ld.getAgeInMonths('2024-05-15')).toBe(478)
  expect(ld.getAgeInDays('2024-05-15')).toBe(14573)
  expect(ld.getAgeIn('day', '2024-05-15')).toBe(14573)
})

test('constructors', () => {
  const s = localDate('1984-06-21').toISODate()
  expect(localDate.fromInput('1984-06-21').toISODate()).toBe(s)
  expect(localDate.fromInput(localDate('1984-06-21')).toISODate()).toBe(s)
  expect(localDate.fromIsoDateString('1984-06-21').toISODate()).toBe(s)
  expect(localDate.fromCompactString('19840621').toISODate()).toBe(s)
  expect(localDate.fromInput(new Date(1984, 5, 21)).toISODate()).toBe(s)
  expect(localDate.fromDate(new Date(1984, 5, 21)).toISODate()).toBe(s)
  expect(localDate.fromDateObject({ year: 1984, month: 6, day: 21 }).toISODate()).toBe(s)
})

test('isBetween', () => {
  const ld = localDate.fromInput('1984-06-21')
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

  expect(localDate.sort(items).map(s => s.toString())).toEqual([
    '2022-01-01',
    '2022-01-02',
    '2022-01-03',
  ])

  expect(localDate.min(items).toString()).toBe('2022-01-01')
  expect(localDate.minOrUndefined(items)?.toString()).toBe('2022-01-01')
  expect(localDate.max(items).toString()).toBe('2022-01-03')
  expect(localDate.maxOrUndefined(items)?.toString()).toBe('2022-01-03')

  // Test that undefined values are allowed
  expect(localDate.max([...items, undefined]).toString()).toBe('2022-01-03')
})

test('add basic', () => {
  const ld = localDate('2022-01-01')

  expect(ld.clone().plus(1, 'day', true).toString()).toBe('2022-01-02')
  expect(ld.plus(-1, 'day').toString()).toBe('2021-12-31')
  expect(ld.minus(1, 'day').toString()).toBe('2021-12-31')
  expect(ld.minus(1, 'day').toString()).toBe('2021-12-31')
  expect(ld.plus(-1, 'month').toString()).toBe('2021-12-01')

  const d = localDate('2022-05-31')
  expect(d.plusMonths(1).toISODate()).toBe('2022-06-30')
  expect(d.minusMonths(1).toISODate()).toBe('2022-04-30')
})

test('add', () => {
  const starts = ['2022-05-31', '2022-05-30', '2020-02-29', '2021-02-28', '2022-01-01']

  starts.forEach(start => {
    const ld = localDate(start)
    const d = dayjs(start)

    units.forEach(unit =>
      _range(UNIT_RANGE[unit]).forEach(i => {
        let expected = d.add(i, unit).toISODate()
        let actual = ld.plus(i, unit).toString()

        expectWithMessage(`${ld} + ${i} ${unit}`, expected, actual)

        actual = ld.plus(-i, unit).toString()
        expected = d.add(-i, unit).toISODate()

        expectWithMessage(`${ld} - ${i} ${unit}`, expected, actual)
      }),
    )
  })
})

test('diff', () => {
  const starts = ['2022-05-31', '2022-05-30', '2020-02-29', '2021-02-28', '2022-01-01']

  starts.forEach(start => {
    const ld = localDate.fromInput(start)
    const d = dayjs(start)

    units.forEach(unitAdd => {
      _range(UNIT_RANGE[unitAdd]).forEach(i => {
        units.forEach(unit => {
          let left = ld.plus(i, unitAdd)
          let right = ld
          let actual = left.diff(right, unit)
          let expected = d.add(i, unitAdd).diff(d, unit)
          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)

          left = ld
          right = ld.plus(i, unitAdd)
          actual = left.diff(right, unit)
          expected = d.diff(d.add(i, unitAdd), unit)
          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)

          left = ld.plus(-i, unitAdd)
          right = ld
          actual = left.diff(right, unit)
          expected = d.add(-i, unitAdd).diff(d, unit)
          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)

          left = ld.plus(i, unitAdd).plus(40, 'day')
          right = ld
          actual = left.diff(right, unit)
          expected = d.add(i, unitAdd).add(40, 'day').diff(d, unit)
          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)
        })
      })
    })
  })
})

// prettier-ignore
const validDates = [
  '2022-01-01',
  '2023-12-29',
]

// prettier-ignore
const looselyValidDates = [
  '2022-01-01T22:01:01',
  '2022-01-01T22:01:01Z',
  '2022-01-01nahuy',
]

// prettier-ignore
const invalidDates = [
  undefined,
  5,
  '',
  '2022-01-',
  '2022-01-x1',
] as string[]

test.each(validDates)('%s is valid', s => {
  expect(localDate.isValid(s)).toBe(true)
  expect(localDate.isValidString(s)).toBe(true)
  expect(localDate(s).toISODate()).toBe(s)
  expect(localDate.fromIsoDateString(s).toISODate()).toBe(s)
  expect(localDate.parse(s).toISODate()).toBe(s)
  expect(localDate.try(s)?.toISODate()).toBe(s)
})

test.each(looselyValidDates)('%s is loosely valid', s => {
  expect(localDate.isValid(s)).toBe(false)
  expect(localDate.isValidString(s)).toBe(false)
  expect(() => localDate(s)).toThrow('Cannot parse')
  expect(() => localDate.fromIsoDateString(s)).toThrow('Cannot parse')
  expect(localDate.parse(s).toISODate()).toBe(s.slice(0, 10))
  expect(localDate.try(s)?.toISODate()).toBe(s.slice(0, 10))
})

test.each(invalidDates)('%s is invalid', s => {
  expect(localDate.isValid(s)).toBe(false)
  expect(localDate.isValidString(s)).toBe(false)
  expect(() => localDate(s)).toThrow('Cannot parse')
  expect(() => localDate.fromIsoDateString(s)).toThrow('Cannot parse')
  expect(() => localDate.parse(s)).toThrow('Cannot parse')
  expect(localDate.try(s)).toBeUndefined()
})

test('toDate', () => {
  const str = '2022-03-06'
  const d = localDate.fromInput(str)
  if (isUTC()) {
    // timezone-dependent
    expect(d.toDate()).toMatchInlineSnapshot(`2022-03-06T00:00:00.000Z`)
  }
  expect(d.toDateInUTC()).toMatchInlineSnapshot(`2022-03-06T00:00:00.000Z`)
  const d2 = localDate.fromDate(d.toDate())
  expect(d2.toString()).toBe(str)
  expect(d2.isSame(d)).toBe(true)
  expect(d2.compare(d)).toBe(0)
  expect(d2.isAfter(d)).toBe(false)
  expect(d2.isBefore(d)).toBe(false)
  expect(d2.isSameOrAfter(d)).toBe(true)
  expect(d2.isSameOrBefore(d)).toBe(true)
})

test('range', () => {
  expect(localDate.range('2021-12-24', '2021-12-26')).toMatchInlineSnapshot(`
    [
      "2021-12-24",
      "2021-12-25",
    ]
  `)

  expect(localDate.range('2021-12-24', '2021-12-26', '[]')).toMatchInlineSnapshot(`
    [
      "2021-12-24",
      "2021-12-25",
      "2021-12-26",
    ]
  `)

  expect(localDate.range('2021-12-24', '2021-12-30', '[)', 2)).toMatchInlineSnapshot(`
    [
      "2021-12-24",
      "2021-12-26",
      "2021-12-28",
    ]
  `)

  expect(localDate.range('2021-12-24', '2021-12-30', '[]', 2)).toMatchInlineSnapshot(`
    [
      "2021-12-24",
      "2021-12-26",
      "2021-12-28",
      "2021-12-30",
    ]
  `)
})

test('rangeIterable', () => {
  expect([...localDate.rangeIterable('2021-12-24', '2021-12-26')]).toMatchInlineSnapshot(`
    [
      "2021-12-24",
      "2021-12-25",
    ]
  `)
})

test('format', () => {
  const fmt: LocalDateFormatter = ld => `${ld.year}-${String(ld.month).padStart(2, '0')}`
  expect(localDate('1984-06-21').format(fmt)).toBe('1984-06')

  const fmt2: LocalDateFormatter = ld => `${String(ld.month).padStart(2, '0')}/${ld.year}`
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

test('parse weird input', () => {
  // should not fail, but return null gracefully
  expect(localDate.try(5 as any)).toBeUndefined()
  expect(localDate.try(Date.now() as any)).toBeUndefined()
  expect(localDate.try((() => {}) as any)).toBeUndefined()
})

test('dayOfWeek', () => {
  expect(localDate('1984-06-18').dayOfWeek).toBe(1)
  expect(localDate('1984-06-19').dayOfWeek).toBe(2)
  expect(localDate('1984-06-20').dayOfWeek).toBe(3)
  expect(localDate('1984-06-21').dayOfWeek).toBe(4)
  expect(localDate('1984-06-22').dayOfWeek).toBe(5)
  expect(localDate('1984-06-23').dayOfWeek).toBe(6)
  expect(localDate('1984-06-24').dayOfWeek).toBe(7)
  expect(localDate('1984-06-25').dayOfWeek).toBe(1)
})

// You shouldn't do it, I'm just discovering that it works, apparently
test('comparison with string', () => {
  const d = localDate('1984-06-21') as any
  expect(d < '1984-06-22').toBe(true)
  expect(d < '1985-06-22').toBe(true)
  expect(d <= '1984-06-21').toBe(true)
  expect(d < '1984-06-20').toBe(false)
  expect(d >= '1984-06-21').toBe(true)
  expect(d > '1984-06-20').toBe(true)
  expect(d > '1981-06-20').toBe(true)
})

// You shouldn't do it, I'm just discovering that it works, apparently
test('comparison with other LocalDates like primitives', () => {
  const d = localDate('1984-06-21') as any
  expect(d < localDate('1984-06-22')).toBe(true)
  expect(d < localDate('1985-06-22')).toBe(true)
  expect(d <= localDate('1984-06-21')).toBe(true)
  expect(d < localDate('1984-06-20')).toBe(false)
  expect(d >= localDate('1984-06-21')).toBe(true)
  expect(d > localDate('1984-06-20')).toBe(true)
  expect(d > localDate('1981-06-20')).toBe(true)
})

test('todayString', () => {
  // expect(nowUnix()).toBeGreaterThan(localTime('2024-01-01').unix())
  const s = localDate.todayString()
  expect(s.startsWith(new Date().getFullYear() + '-')).toBe(true)
  expect(s > '2024-05-01').toBe(true)
  expect(s < '2099-01-01').toBe(true)
})

test('todayString tz', () => {
  if (isUTC()) return
  console.log(process.env['TZ'])
  console.log(localDate.todayString())
  console.log(new Date().toString())
})
