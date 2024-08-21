import { dayjs } from '@naturalcycles/time-lib'
import { _range } from '../array/range'
import { expectWithMessage, isUTC } from '../test/test.util'
import { ISODayOfWeek, localTime, LocalTimeFormatter, LocalTimeUnit } from './localTime'

const units: LocalTimeUnit[] = ['year', 'month', 'day', 'hour', 'minute', 'second', 'week']

const UNIT_RANGE: Record<LocalTimeUnit, number> = {
  year: 1000,
  month: 100,
  week: 1000,
  day: 5000,
  hour: 10000,
  minute: 10000,
  second: 10000,
}

test('basic', () => {
  const start = '2022-01-01T00:00:00'
  const lt = localTime.fromInput(start)
  expect(lt.year).toBe(2022)
  expect(lt.month).toBe(1)
  expect(lt.day).toBe(1)
  expect(lt.week).toBe(52)
  expect(lt.toISODateTime()).toBe('2022-01-01T00:00:00')
  expect(lt.toString()).toBe('2022-01-01T00:00:00')
  expect(lt.toPretty()).toBe('2022-01-01 00:00:00')
  expect(lt.toPretty(false)).toBe('2022-01-01 00:00')
  if (isUTC()) {
    expect(lt.unix).toBe(1640995200)
    expect(lt.valueOf()).toBe(1640995200)
    expect(lt.toJSON()).toBe(1640995200)
  }
  expect(lt.toMonthId()).toBe('2022-01')
  const lt2 = lt.clone()
  expect(lt2).not.toBe(lt)
  // eslint-disable-next-line jest/prefer-equality-matcher
  expect(lt2 === lt).toBe(false)
  expect(lt.isSame(lt2)).toBe(true)
  expect(lt.isAfter(lt2)).toBe(false)
  expect(lt.isBefore(lt2)).toBe(false)
  expect(lt.isSameOrAfter(lt2)).toBe(true)
  expect(lt.isSameOrBefore(lt2)).toBe(true)
  expect(lt.compare(lt2)).toBe(0)

  expect(lt.isOlderThan(5, 'day')).toBe(true)
  expect(lt.isYoungerThan(5, 'day')).toBe(false)
  expect(lt.isOlderThan(100, 'year')).toBe(false)
  expect(lt.getAgeInYears('2024-05-15')).toBe(2)
  expect(lt.getAgeInMonths('2024-05-15')).toBe(28)
  expect(lt.getAgeInDays('2024-05-15')).toBe(865)
  expect(lt.getAgeIn('day', '2024-05-15')).toBe(865)

  expect(lt.isAfterNow()).toBe(false)
  expect(lt.isBeforeNow()).toBe(true)

  expect(lt.setYear(2023).year).toBe(2023)
  expect(lt.year).toBe(2022) // not changed

  expect(lt.toISODate()).toBe('2022-01-01')
  expect(lt.toISOTime()).toBe('00:00:00')
  expect(lt.toISOTime(false)).toBe('00:00')
  if (isUTC()) {
    expect(lt.toStringCompact()).toBe('20220101_0000')
    expect(lt.toStringCompact(true)).toBe('20220101_000000')
  }

  expect(lt.toLocalDate().toString()).toBe('2022-01-01')

  if (isUTC()) {
    expect(localTime.fromUnix(1640995200).toString()).toBe(lt.toString())
    expect(localTime.fromMillis(1640995200000).toString()).toBe(lt.toString())
    expect(localTime.fromInput(new Date(1640995200000)).toString()).toBe(lt.toString())
  }

  expect(lt.setYear(2023).toISODateTime()).toBe('2023-01-01T00:00:00')
  expect(lt.setMonth(12).toISODateTime()).toBe('2022-12-01T00:00:00')
  expect(lt.setDay(31).toISODateTime()).toBe('2022-01-31T00:00:00')
  expect(lt.setWeek(1).toISODateTime()).toBe('2021-01-09T00:00:00')
  expect(lt.setWeek(2).toISODateTime()).toBe('2021-01-16T00:00:00')
  expect(lt.setWeek(3).toISODateTime()).toBe('2021-01-23T00:00:00')
  expect(lt.setWeek(52).toISODateTime()).toBe('2022-01-01T00:00:00')
  expect(lt.setWeek(53).toISODateTime()).toBe('2022-01-08T00:00:00')
  expect(lt.setWeek(54).toISODateTime()).toBe('2022-01-15T00:00:00')
  expect(lt.setWeek(54).week).toBe(2)
  expect(lt.setWeek(53).week).toBe(1)
  expect(lt.setWeek(52).week).toBe(52)

  // console.log(lt.getDate())
  // console.log(lt.startOf('year').getDate())
  lt.setComponents(
    {
      hour: 1,
      minute: 2,
      second: 3,
    },
    true,
  )
  if (isUTC()) {
    expect(lt.startOf('year').toISODateTime()).toBe('2022-01-01T00:00:00')
    expect(lt.startOf('month').toISODateTime()).toBe('2022-01-01T00:00:00')
    expect(lt.startOf('day').toISODateTime()).toBe('2022-01-01T00:00:00')
    expect(lt.startOf('hour').toISODateTime()).toBe('2022-01-01T01:00:00')
    expect(lt.startOf('minute').toISODateTime()).toBe('2022-01-01T01:02:00')
    expect(lt.startOf('second').toISODateTime()).toBe('2022-01-01T01:02:03')
    expect(lt.startOf('week').toISODateTime()).toBe('2021-12-27T00:00:00')

    expect(lt.endOf('year').toISODateTime()).toBe('2022-12-31T23:59:59')
    expect(lt.endOf('month').toISODateTime()).toBe('2022-01-31T23:59:59')
    expect(lt.endOf('day').toISODateTime()).toBe('2022-01-01T23:59:59')
    expect(lt.endOf('hour').toISODateTime()).toBe('2022-01-01T01:59:59')
    expect(lt.endOf('minute').toISODateTime()).toBe('2022-01-01T01:02:59')
    expect(lt.endOf('second').toISODateTime()).toBe('2022-01-01T01:02:03')
    expect(lt.endOf('week').toISODateTime()).toBe('2022-01-02T23:59:59')
  }
  expect(lt.daysInMonth).toBe(31)
  expect(lt.setMonth(2).daysInMonth).toBe(28)
  expect(lt.setMonth(4).daysInMonth).toBe(30)

  expect(localTime.orUndefined(undefined)).toBeUndefined()
  expect(localTime.orUndefined(null)).toBeUndefined()
  expect(localTime.orUndefined(0)?.toPretty()).toBe('1970-01-01 00:00:00')
  expect(localTime.orUndefined(start)?.toISODate()).toBe('2022-01-01')

  expect(localTime.now().toString()).toBeDefined()
  expect(localTime.orNow(undefined).toString()).toBeDefined()
  expect(localTime.orNow(lt).toISODate()).toBe(lt.toISODate())

  expect(() => localTime(undefined as any)).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "undefined" into LocalTime"`,
  )

  expect(localTime(0).toISODateTime()).toMatchInlineSnapshot(`"1970-01-01T00:00:00"`)

  expect(localTime.getTimezone()).toBe('UTC')
  expect(localTime.isTimezoneValid('Europe/Stockholm')).toBe(true)
  expect(localTime.isTimezoneValid('Europe/Stockholm2')).toBe(false)
})

test('isBetween', () => {
  const ld = localTime('1984-06-21')
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

test('fromNow', () => {
  const past = localTime('2022-02-24')
  const now = localTime('2022-03-28')
  const future = localTime('2022-04-01')

  expect(past.toFromNowString(now)).toBe('32 days ago')
  expect(now.toFromNowString(now)).toBe('now')
  expect(future.toFromNowString(now)).toBe('in 4 days')
})

// prettier-ignore
const validDates = [
  ['2022-01-01', '2022-01-01T00:00:00'],
  ['2023-12-29', '2023-12-29T00:00:00'],
  ['2022-01-31T05:05:05', '2022-01-31T05:05:05'],
  ['2022-01-31T05:05:05.whatever at this point', '2022-01-31T05:05:05'],
  ['2022-01-31T05:05:05.123', '2022-01-31T05:05:05'],
  ['2022-01-31T05:05:05.123Z', '2022-01-31T05:05:05'],
  ['2022-01-31T05:05:05Z', '2022-01-31T05:05:05'],
  ['2022-01-01T22:01:01Z', '2022-01-01T22:01:01'],
  ['2022-01-01 22:01:01', '2022-01-01T22:01:01'],
  ['2022-01-01t22:01:01', '2022-01-01T22:01:01'],
]

// prettier-ignore
const looselyValidDates = [
  ['2022/01/31', '2022-01-31T00:00:00'],
  ['2022-1-1', '2022-01-01T00:00:00'],
  ['2022-03-', '2022-03-01T00:00:00'],
  ['2022-01-02nahuy', '2022-01-02T00:00:00'],
  ['2022-01-31T', '2022-01-31T00:00:00'],
  ['2022-01-31T05:06', '2022-01-31T05:06:00'],
  ['2022-01-31T05:0', '2022-01-31T05:00:00'],
  ['2022-01-31T05', '2022-01-31T05:00:00'],
  ['2022-01-31T0', '2022-01-31T00:00:00'],
]

// prettier-ignore
const invalidDates = [
  undefined,
  5,
  'abcd',
  '2022-01-x1',
  '20220131',
  '2022-01-32',
] as string[]

test.each(validDates)('%s parses to %s and is strictly valid', (s, expected) => {
  expect(localTime.isValid(s)).toBe(true)
  expect(localTime.isValidString(s)).toBe(true)
  expect(localTime(s).toISODate()).toBe(expected.slice(0, 10))
  expect(localTime.fromIsoDateTimeString(s).toISODate()).toBe(expected.slice(0, 10))
  expect(localTime(s).toString()).toBe(expected)
  expect(localTime.parse(s).toString()).toBe(expected)
  expect(localTime.try(s)?.toString()).toBe(expected)
})

test.each(looselyValidDates)('%s parses to %s and is loosely valid', (s, expected) => {
  expect(localTime.isValid(s)).toBe(false)
  expect(localTime.isValidString(s)).toBe(false)
  expect(() => localTime(s)).toThrow('Cannot parse')
  expect(() => localTime.fromIsoDateTimeString(s)).toThrow('Cannot parse')
  expect(localTime.parse(s).toISODate()).toBe(expected.slice(0, 10))
  expect(localTime.parse(s).toString()).toBe(expected)
  expect(localTime.try(s)?.toString()).toBe(expected)
})

test.each(invalidDates)('%s is invalid', s => {
  expect(localTime.isValidString(s)).toBe(false)
  expect(() => localTime.fromIsoDateTimeString(s)).toThrow('Cannot parse')
  expect(() => localTime.parse(s)).toThrow('Cannot parse')
})

// test.each(invalidDates)('%s is invalid', s => {
//   expect(localDate.isValid(s)).toBe(false)
//   expect(localDate.isValidString(s)).toBe(false)
//   expect(() => localDate(s)).toThrow('Cannot parse')
//   expect(() => localDate.fromIsoDateString(s)).toThrow('Cannot parse')
//   expect(() => localDate.parseString(s)).toThrow('Cannot parse')
//   expect(localDate.try(s)).toBeUndefined()
// })

test('add', () => {
  if (!isUTC()) return
  const starts = ['2022-05-31', '2022-05-30', '2020-02-29', '2021-02-28', '2022-01-01']

  starts.forEach(start => {
    const lt = localTime(start)
    const d = dayjs(start)

    units.forEach(unit => {
      _range(UNIT_RANGE[unit]).forEach(i => {
        let expected = d.add(i, unit)
        let actual = lt.plus(i, unit)

        expectWithMessage(`${lt} + ${i} ${unit}`, expected.unix(), actual.unix, expected, actual)
        expectWithMessage(
          `${lt} + ${i} ${unit}`,
          expected.unixMillis(),
          actual.unixMillis,
          expected,
          actual,
        )
        expectWithMessage(
          `${lt} + ${i} ${unit}`,
          expected.toISODate(),
          actual.toISODate(),
          expected,
          actual,
        )
        expectWithMessage(
          `${lt} + ${i} ${unit}`,
          expected.format(),
          actual.toISODateTime() + '+00:00',
          expected,
          actual,
        )

        expected = d.subtract(i, unit)
        actual = lt.minus(i, unit)
        expectWithMessage(`${lt} - ${i} ${unit}`, expected.unix(), actual.unix, expected, actual)

        units.forEach(roundUnit => {
          // console.log(unit2, lt.add(i, unit).startOf(unit2).toPretty(), d.add(i, unit).startOf(unit2).toPretty())
          // expect(lt.add(i, unit).startOf(unit2).unix()).toBe(d.add(i, unit).startOf(unit2).unix())
          expected = d.add(i, unit).startOf(roundUnit)
          actual = lt.plus(i, unit).startOf(roundUnit)

          expectWithMessage(
            `${lt} + ${i} ${unit} startOf(${roundUnit})`,
            expected.unix(),
            actual.unix,
            expected,
            actual,
          )

          expected = d.add(i, unit).endOf(roundUnit)
          actual = lt.plus(i, unit).endOf(roundUnit)

          expectWithMessage(
            `${lt} + ${i} ${unit} endOf(${roundUnit})`,
            expected.unix(),
            actual.unix,
            expected,
            actual,
          )

          expected = d.add(i, unit).add(40, 'day').startOf(roundUnit)
          actual = lt.plus(i, unit).plus(40, 'day').startOf(roundUnit)

          expectWithMessage(
            `${lt} + ${i} ${unit} + 40 days startOf(${roundUnit})`,
            expected.unix(),
            actual.unix,
            expected,
            actual,
          )
        })
      })
    })
  })
})

test('diff', () => {
  if (!isUTC()) return
  const starts = ['2022-05-31', '2022-05-30', '2020-02-29', '2021-02-28', '2022-01-01']
  // const starts = ['2020-02-29']

  starts.forEach(start => {
    const lt = localTime(start)
    const d = dayjs(start)

    units.forEach(unit => {
      units.forEach(unitAdd => {
        _range(UNIT_RANGE[unitAdd]).forEach(i => {
          let left = lt.plus(i, unitAdd)
          let right = lt
          let actual = left.diff(right, unit)
          let expected = d.add(i, unitAdd).diff(d, unit)

          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)

          actual = right.diff(left, unit)
          expected = d.diff(d.add(i, unitAdd), unit)

          expectWithMessage(`${right} diff ${left} in ${unit}`, expected, actual)

          left = lt
          right = lt.plus(-i, unitAdd)
          actual = left.diff(right, unit)
          expected = d.diff(d.add(-i, unitAdd), unit)
          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)
        })
      })
    })
  })
})

test('timezone-full string', () => {
  if (!isUTC()) return // todo: this should parse to the same unixtime regardless of TZ
  const lt = localTime.fromInput('2022-04-06T23:15:00+09:00')
  expect(lt.unix).toMatchInlineSnapshot(`1649286900`)
  expect(lt.toPretty()).toBe('2022-04-06 23:15:00')
})

test('startOf should have 0 millis', () => {
  const t = localTime.now().startOf('day')
  expect(t.toDate().getMilliseconds()).toBe(0)
  expect(t.toDate().getSeconds()).toBe(0)
  expect(t.toDate().getMinutes()).toBe(0)
  expect(t.toDate().getHours()).toBe(0)
})

test('format', () => {
  const fmt: LocalTimeFormatter = ld => `${ld.year}-${String(ld.month).padStart(2, '0')}`
  expect(localTime('1984-06-21').format(fmt)).toBe('1984-06')

  const fmt2 = new Intl.DateTimeFormat('ru', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
  expect(localTime('1984-06-21T05:23:13').format(fmt2)).toBe('21 июня в 05:23')
})

test('dayOfWeek', () => {
  const t = localTime('1984-06-21')
  expect(t.dayOfWeek).toBe(ISODayOfWeek.THURSDAY)

  expect(() => t.setDayOfWeek(-1 as any)).toThrowErrorMatchingInlineSnapshot(
    `"Invalid dayOfWeek: -1"`,
  )
  expect(() => t.setDayOfWeek(0 as any)).toThrowErrorMatchingInlineSnapshot(
    `"Invalid dayOfWeek: 0"`,
  )
  expect(() => t.setDayOfWeek(8 as any)).toThrowErrorMatchingInlineSnapshot(
    `"Invalid dayOfWeek: 8"`,
  )
  expect(t.setDayOfWeek(1).toISODate()).toBe('1984-06-18')
  expect(t.setDayOfWeek(2).toISODate()).toBe('1984-06-19')
  expect(t.setDayOfWeek(3).toISODate()).toBe('1984-06-20')
  expect(t.setDayOfWeek(4).toISODate()).toBe('1984-06-21')
  expect(t.setDayOfWeek(5).toISODate()).toBe('1984-06-22')
  expect(t.setDayOfWeek(6).toISODate()).toBe('1984-06-23')
  expect(t.setDayOfWeek(7).toISODate()).toBe('1984-06-24')
})

test('diff2', () => {
  expect(localTime('2020-03-03').diff('1991-06-21', 'year')).toBe(28)

  const ld = localTime('2022-01-01')
  expect(ld.diff('2020-12-31', 'year')).toBe(1)
  expect(ld.diff('2021-01-01', 'year')).toBe(1)
  expect(ld.diff('2021-01-02', 'year')).toBe(0)

  // day 2022-01-01 2020-12-01
  expect(localTime('2020-12-01').diff(ld, 'day')).toBe(-396)
  expect(ld.diff('2020-12-01', 'day')).toBe(396)
})

test('fromDateTimeObject', () => {
  if (!isUTC()) return
  const lt = localTime.fromDateTimeObject({ year: 1984, month: 6, day: 21 })
  expect(lt.toISODate()).toBe('1984-06-21')
})

test('add edge', () => {
  if (!isUTC()) return
  // 2020-02-29 - 2020 year == 0000-02-29 00:00:00
  // expect(localTime('2020-02-29').add(-2020, 'year').toPretty()).toBe(dayjs('2020-02-29').add(-2020, 'year').toPretty())

  expect(localTime('2022-05-31').plusMonths(21).toPretty()).toBe('2024-02-29 00:00:00')

  expect(localTime('2022-05-31').plusMonths(1).toPretty()).toBe('2022-06-30 00:00:00')
  expect(localTime('2022-05-31').minusMonths(1).toPretty()).toBe('2022-04-30 00:00:00')

  expect(localTime('2020-02-29').plus(1, 'month').toPretty()).toBe('2020-03-29 00:00:00')
  expect(localTime('2020-03-29').plus(-1, 'month').toPretty()).toBe('2020-02-29 00:00:00')
  expect(localTime('2020-03-30').plus(-1, 'month').toPretty()).toBe('2020-02-29 00:00:00')
  expect(localTime('2020-03-31').plus(-1, 'month').toPretty()).toBe('2020-02-29 00:00:00')
  expect(localTime('2020-01-31').plus(1, 'month').toPretty()).toBe('2020-02-29 00:00:00')
  expect(localTime('2020-01-31').plus(2, 'month').toPretty()).toBe('2020-03-31 00:00:00')
  expect(localTime('2020-01-31').plus(3, 'month').toPretty()).toBe('2020-04-30 00:00:00')
  expect(localTime('2020-02-29').plusYears(1).toPretty()).toBe('2021-02-28 00:00:00')
  expect(localTime('2021-02-28').minusYears(1).toPretty()).toBe('2020-02-28 00:00:00')
})

test('diff edge', () => {
  // 2022-05-31 + 1 month == 2022-06-30 00:00:00 should diff 1 month
  // console.log(differenceInMonths(new Date('2022-06-30'), new Date('2022-05-31')))
  // console.log(differenceInMonths(new Date('2022-05-31'), new Date('2022-04-30')))
  // console.log(differenceInMonths(new Date('2022-05-31'), new Date('2022-04-30T23:00:00')))
  //
  // console.log(moment('2022-05-31').diff('2022-04-30', 'month'))
  // console.log(moment('2022-05-31').diff('2022-04-30T23:00:00', 'month'))

  expect(localTime('2022-06-30').diff('2022-05-31', 'month')).toBe(
    dayjs('2022-06-30').diff('2022-05-31', 'month'),
  )
  expect(localTime('2022-06-30').diff('2022-05-31', 'month')).toBe(1)

  // 2022-05-31 - 721 hour == 2022-04-30 23:00:00 should diff 0 month
  expect(localTime('2022-05-31').diff('2022-04-30', 'month')).toBe(
    dayjs('2022-05-31').diff('2022-04-30', 'month'),
  )
  expect(localTime('2022-05-31').diff('2022-04-30T23:00:00', 'month')).toBe(
    dayjs('2022-05-31').diff('2022-04-30T23:00:00', 'month'),
  )

  // 2022-05-31 + 1 day == 2022-06-01 00:00:00 should diff 0 month
  expect(localTime('2022-06-01').diff('2022-05-31', 'month')).toBe(0)
})

// You shouldn't do it, I'm just discovering that it works, apparently
test('comparison with string', () => {
  if (!isUTC()) return
  const d = localTime('1984-06-21T05:00:00') as any
  expect(d < localTime('1984-06-22').unix).toBe(true)
  expect(d < localTime('1985-06-22').unix).toBe(true)
  expect(d <= localTime('1984-06-21T05:00:00').unix).toBe(true)
  expect(d < localTime('1984-06-20').unix).toBe(false)
  expect(d >= localTime('1984-06-21').unix).toBe(true)
  expect(d > localTime('1984-06-20').unix).toBe(true)
  expect(d > localTime('1981-06-20').unix).toBe(true)
})

// You shouldn't do it, I'm just discovering that it works, apparently
test('comparison with other LocalTimes like primitives', () => {
  if (!isUTC()) return
  const d = localTime('1984-06-21T05:00:00') as any
  expect(d < localTime('1984-06-22')).toBe(true)
  expect(d < localTime('1985-06-22')).toBe(true)
  expect(d <= localTime('1984-06-21T05:00:00')).toBe(true)
  expect(d < localTime('1984-06-20')).toBe(false)
  expect(d >= localTime('1984-06-21')).toBe(true)
  expect(d > localTime('1984-06-20')).toBe(true)
  expect(d > localTime('1981-06-20')).toBe(true)
})

test('nowUnix', () => {
  expect(localTime.nowUnix()).toBeGreaterThan(localTime('2024-01-01').unix)
})

test('utcOffset', () => {
  const offset = dayjs().utcOffset()
  const offset2 = -new Date().getTimezoneOffset()
  expect(offset2).toBe(offset)

  if (isUTC()) {
    expect(localTime.now().getUTCOffsetMinutes()).toBe(0)
    expect(localTime.now().getUTCOffsetHours()).toBe(0)
  }
})

test('fromDateUTC', () => {
  const s = `1984-06-21T05:00:00`
  const lt = localTime(s).toUTC()
  const ltUtc = lt.toUTC()
  // eslint-disable-next-line jest/prefer-equality-matcher
  expect(lt !== ltUtc).toBe(true) // not the same instance
  expect(lt.unix).toBe(ltUtc.unix)
  expect(ltUtc.toPretty()).toBe(`1984-06-21 05:00:00`)
  expect(ltUtc.toISODate()).toBe(`1984-06-21`)
  expect(ltUtc.toISODateTime()).toBe(s)
  if (isUTC()) {
    expect(lt.unix).toMatchInlineSnapshot(`456642000`)
  }

  const ltLocal = ltUtc.toLocal()
  // eslint-disable-next-line jest/prefer-equality-matcher
  expect(ltLocal !== ltUtc).toBe(true)
  expect(ltLocal.unix).toBe(ltUtc.unix)
  expect(ltLocal.toPretty()).toBe(lt.toPretty())
  // todo: figure out what to assert in non-utc mode
})

test('getUTCOffsetMinutes', () => {
  const now = localTime('2024-05-14')
  expect(now.getUTCOffsetMinutes('America/Los_Angeles')).toBe(-7 * 60)
  expect(now.getUTCOffsetMinutes('America/New_York')).toBe(-4 * 60)
  expect(now.getUTCOffsetMinutes('Europe/Stockholm')).toBe(2 * 60)
  expect(now.getUTCOffsetHours('Europe/Stockholm')).toBe(2)
  expect(now.getUTCOffsetMinutes('UTC')).toBe(0)
  expect(now.getUTCOffsetHours('UTC')).toBe(0)
  expect(now.getUTCOffsetMinutes('GMT')).toBe(0)
  expect(now.getUTCOffsetMinutes('Asia/Tokyo')).toBe(9 * 60)
})

test('getUTCOffsetString', () => {
  const now = localTime('2024-05-14')
  expect(now.getUTCOffsetString('America/Los_Angeles')).toBe('-07:00')
  expect(now.getUTCOffsetString('America/New_York')).toBe('-04:00')
  expect(now.getUTCOffsetString('Europe/Stockholm')).toBe('+02:00')
  expect(now.getUTCOffsetString('UTC')).toBe('+00:00')
  expect(now.getUTCOffsetString('Asia/Tokyo')).toBe('+09:00')
})

test('inTimezone', () => {
  const lt = localTime(`1984-06-21T05:00:00`)
  expect(lt.toPretty()).toBe(`1984-06-21 05:00:00`)

  // Nope, unix doesn't match ;(
  // expect(lt.inTimezone('Europe/Stockholm').unix()).toBe(lt.unix())

  expect(lt.inTimezone('Europe/Stockholm').toPretty()).toBe(`1984-06-21 07:00:00`)
  expect(lt.inTimezone('America/New_York').toPretty()).toBe(`1984-06-21 01:00:00`)
  expect(lt.inTimezone('America/Los_Angeles').toPretty()).toBe(`1984-06-20 22:00:00`)
  expect(lt.inTimezone('Asia/Tokyo').toPretty()).toBe(`1984-06-21 14:00:00`)
  expect(lt.inTimezone('Asia/Tokyo').toPretty(false)).toBe(`1984-06-21 14:00`)

  const lt2 = localTime(`1984-02-14T21:00:00`)
  expect(lt2.toPretty()).toBe(`1984-02-14 21:00:00`)
  expect(lt2.inTimezone('Europe/Stockholm').toPretty()).toBe(`1984-02-14 22:00:00`)
  expect(lt2.inTimezone('America/New_York').toPretty()).toBe(`1984-02-14 16:00:00`)
  expect(lt2.inTimezone('America/Los_Angeles').toPretty()).toBe(`1984-02-14 13:00:00`)
  expect(lt2.inTimezone('Asia/Tokyo').toPretty()).toBe(`1984-02-15 06:00:00`)
})

// This test should work both in `yarn test` (UTC) and `yarn test-tz2` (JST-09)
test('parsing date string in negative timezone bug', () => {
  const s = '2023-03-03'
  console.log(new Date(s).toString())
  const lt = localTime(s)
  expect(lt.toISODate()).toBe(s)
  expect(lt.toPretty()).toBe('2023-03-03 00:00:00')
})

test('fractional unit input', () => {
  const lt = localTime('1984-06-21')
  expect(lt.toString()).toBe('1984-06-21T00:00:00')

  // Comparing only IsoDate part (no time component)
  expect(lt.plus(0.4, 'day').toISODate()).toBe('1984-06-21')
  expect(lt.plus(0.5, 'day').toISODate()).toBe('1984-06-21')
  expect(lt.plus(0.9, 'day').toISODate()).toBe('1984-06-21')
  expect(lt.plus(1.1, 'day').toISODate()).toBe('1984-06-22')
  expect(lt.minus(0.4, 'day').toISODate()).toBe('1984-06-20')
  expect(lt.minus(0.5, 'day').toISODate()).toBe('1984-06-20')
  expect(lt.minus(0.9, 'day').toISODate()).toBe('1984-06-20')
  expect(lt.minus(1.1, 'day').toISODate()).toBe('1984-06-19')

  // Comparing full date+time component.
  // LocalTime does NOT support fractional input, so it should be coerced (Math.floored) to Integer
  expect(lt.plus(0.4, 'day').toString()).toBe('1984-06-21T00:00:00')
  expect(lt.plus(0.5, 'day').toString()).toBe('1984-06-21T00:00:00')
  expect(lt.plus(0.9, 'day').toString()).toBe('1984-06-21T00:00:00')
  expect(lt.plus(1.1, 'day').toString()).toBe('1984-06-22T00:00:00')
  expect(lt.minus(0.4, 'day').toString()).toBe('1984-06-20T00:00:00')
  expect(lt.minus(0.5, 'day').toString()).toBe('1984-06-20T00:00:00')
  expect(lt.minus(0.9, 'day').toString()).toBe('1984-06-20T00:00:00')
  expect(lt.minus(1.1, 'day').toString()).toBe('1984-06-19T00:00:00')

  expect(() => localTime('1984-06-21.5')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "1984-06-21.5" into LocalTime"`,
  )
})
