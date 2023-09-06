import { dayjs } from '@naturalcycles/time-lib'
import { _range } from '../array/range'
import { expectWithMessage } from '../test/test.util'
import type { LocalTimeFormatter, LocalTimeUnit } from './localTime'
import {
  ISODayOfWeek,
  localTime,
  LocalTime,
  localTimeNow,
  localTimeOrNow,
  localTimeOrUndefined,
} from './localTime'

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
  const start = '2022-01-01'
  const lt = LocalTime.of(start)
  expect(lt.year()).toBe(2022)
  expect(lt.month()).toBe(1)
  expect(lt.day()).toBe(1)
  expect(lt.week()).toBe(52)
  expect(lt.toISODateTime()).toBe('2022-01-01T00:00:00')
  expect(lt.toString()).toBe('2022-01-01T00:00:00')
  expect(lt.toPretty()).toBe('2022-01-01 00:00:00')
  expect(lt.toPretty(false)).toBe('2022-01-01 00:00')
  expect(lt.unix()).toBe(1640995200)
  expect(lt.valueOf()).toBe(1640995200)
  expect(lt.toJSON()).toBe(1640995200)
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
  expect(lt.cmp(lt2)).toBe(0)

  expect(lt.isOlderThan(5, 'day')).toBe(true)
  expect(lt.isOlderThan(100, 'year')).toBe(false)

  expect(lt.year(2023).year()).toBe(2023)
  expect(lt.year()).toBe(2022) // not changed

  expect(lt.toISODate()).toBe('2022-01-01')
  expect(lt.toISOTime()).toBe('00:00:00')
  expect(lt.toISOTime(false)).toBe('00:00')
  expect(lt.toStringCompact()).toBe('20220101_0000')
  expect(lt.toStringCompact(true)).toBe('20220101_000000')

  expect(lt.toLocalDate().toString()).toBe('2022-01-01')

  expect(LocalTime.ofMillis(1640995200000).toString()).toBe(lt.toString())
  expect(LocalTime.of(new Date(1640995200000)).toString()).toBe(lt.toString())

  expect(lt.year(2023).toISODateTime()).toBe('2023-01-01T00:00:00')
  expect(lt.month(12).toISODateTime()).toBe('2022-12-01T00:00:00')
  expect(lt.day(31).toISODateTime()).toBe('2022-01-31T00:00:00')
  expect(lt.week(1).toISODateTime()).toBe('2021-01-09T00:00:00')
  expect(lt.week(2).toISODateTime()).toBe('2021-01-16T00:00:00')
  expect(lt.week(3).toISODateTime()).toBe('2021-01-23T00:00:00')
  expect(lt.week(52).toISODateTime()).toBe('2022-01-01T00:00:00')
  expect(lt.week(53).toISODateTime()).toBe('2022-01-08T00:00:00')
  expect(lt.week(54).toISODateTime()).toBe('2022-01-15T00:00:00')
  expect(lt.week(54).week()).toBe(2)
  expect(lt.week(53).week()).toBe(1)
  expect(lt.week(52).week()).toBe(52)

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

  expect(localTimeOrUndefined()).toBeUndefined()
  expect(localTimeOrUndefined(null)).toBeUndefined()
  expect(localTimeOrUndefined(0 as any)).toBeUndefined()
  expect(localTimeOrUndefined(start)?.toISODate()).toBe(start)

  expect(localTimeNow().toString()).toBeDefined()
  expect(localTimeOrNow().toString()).toBeDefined()
  expect(localTimeOrNow(lt).toISODate()).toBe(lt.toISODate())

  expect(() => localTime(undefined as any)).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "undefined" into LocalTime"`,
  )
})

test('isBetween', () => {
  const ld = LocalTime.of('1984-06-21')
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

  expect(past.fromNow(now)).toBe('32 days ago')
  expect(now.fromNow(now)).toBe('now')
  expect(future.fromNow(now)).toBe('in 4 days')
})

test('validation', () => {
  expect(() => localTime('abcd')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse "abcd" into LocalTime"`,
  )

  expect(LocalTime.isValid('2022-01-01')).toBe(true)
  expect(LocalTime.isValid('abcd')).toBe(false)
  expect(LocalTime.isValid('2022-01-32')).toBe(false)
  expect(LocalTime.isValid('2022-01-31')).toBe(true)
})

test('add', () => {
  const starts = ['2022-05-31', '2022-05-30', '2020-02-29', '2021-02-28', '2022-01-01']

  starts.forEach(start => {
    const lt = LocalTime.of(start)
    const d = dayjs(start)

    units.forEach(unit => {
      _range(UNIT_RANGE[unit]).forEach(i => {
        let expected = d.add(i, unit)
        let actual = lt.add(i, unit)

        expectWithMessage(`${lt} + ${i} ${unit}`, expected.unix(), actual.unix(), expected, actual)
        expectWithMessage(
          `${lt} + ${i} ${unit}`,
          expected.unixMillis(),
          actual.unixMillis(),
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
        actual = lt.subtract(i, unit)
        expectWithMessage(`${lt} - ${i} ${unit}`, expected.unix(), actual.unix(), expected, actual)

        units.forEach(roundUnit => {
          // console.log(unit2, lt.add(i, unit).startOf(unit2).toPretty(), d.add(i, unit).startOf(unit2).toPretty())
          // expect(lt.add(i, unit).startOf(unit2).unix()).toBe(d.add(i, unit).startOf(unit2).unix())
          expected = d.add(i, unit).startOf(roundUnit)
          actual = lt.add(i, unit).startOf(roundUnit)

          expectWithMessage(
            `${lt} + ${i} ${unit} startOf(${roundUnit})`,
            expected.unix(),
            actual.unix(),
            expected,
            actual,
          )

          expected = d.add(i, unit).endOf(roundUnit)
          actual = lt.add(i, unit).endOf(roundUnit)

          expectWithMessage(
            `${lt} + ${i} ${unit} endOf(${roundUnit})`,
            expected.unix(),
            actual.unix(),
            expected,
            actual,
          )

          expected = d.add(i, unit).add(40, 'day').startOf(roundUnit)
          actual = lt.add(i, unit).add(40, 'day').startOf(roundUnit)

          expectWithMessage(
            `${lt} + ${i} ${unit} + 40 days startOf(${roundUnit})`,
            expected.unix(),
            actual.unix(),
            expected,
            actual,
          )
        })
      })
    })
  })
})

test('diff', () => {
  const starts = ['2022-05-31', '2022-05-30', '2020-02-29', '2021-02-28', '2022-01-01']
  // const starts = ['2020-02-29']

  starts.forEach(start => {
    const lt = LocalTime.of(start)
    const d = dayjs(start)

    units.forEach(unit => {
      units.forEach(unitAdd => {
        _range(UNIT_RANGE[unitAdd]).forEach(i => {
          let left = lt.add(i, unitAdd)
          let right = lt
          let actual = left.diff(right, unit)
          let expected = d.add(i, unitAdd).diff(d, unit)

          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)

          actual = right.diff(left, unit)
          expected = d.diff(d.add(i, unitAdd), unit)

          expectWithMessage(`${right} diff ${left} in ${unit}`, expected, actual)

          left = lt
          right = lt.add(-i, unitAdd)
          actual = left.diff(right, unit)
          expected = d.diff(d.add(-i, unitAdd), unit)
          expectWithMessage(`${left} diff ${right} in ${unit}`, expected, actual)
        })
      })
    })
  })
})

test('timezone-full string', () => {
  const lt = LocalTime.of('2022-04-06T23:15:00+09:00')
  expect(lt.toPretty()).toBe('2022-04-06 23:15:00')
})

test('startOf should have 0 millis', () => {
  const t = localTimeNow().startOf('day')
  expect(t.getDate().getMilliseconds()).toBe(0)
  expect(t.getDate().getSeconds()).toBe(0)
  expect(t.getDate().getMinutes()).toBe(0)
  expect(t.getDate().getHours()).toBe(0)
})

test('format', () => {
  const fmt: LocalTimeFormatter = ld => `${ld.year()}-${String(ld.month()).padStart(2, '0')}`
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
  expect(t.dayOfWeek()).toBe(ISODayOfWeek.THURSDAY)

  expect(() => t.dayOfWeek(-1 as any)).toThrowErrorMatchingInlineSnapshot(`"Invalid dayOfWeek: -1"`)
  expect(() => t.dayOfWeek(0 as any)).toThrowErrorMatchingInlineSnapshot(`"Invalid dayOfWeek: 0"`)
  expect(() => t.dayOfWeek(8 as any)).toThrowErrorMatchingInlineSnapshot(`"Invalid dayOfWeek: 8"`)
  expect(t.dayOfWeek(1).toISODate()).toBe('1984-06-18')
  expect(t.dayOfWeek(2).toISODate()).toBe('1984-06-19')
  expect(t.dayOfWeek(3).toISODate()).toBe('1984-06-20')
  expect(t.dayOfWeek(4).toISODate()).toBe('1984-06-21')
  expect(t.dayOfWeek(5).toISODate()).toBe('1984-06-22')
  expect(t.dayOfWeek(6).toISODate()).toBe('1984-06-23')
  expect(t.dayOfWeek(7).toISODate()).toBe('1984-06-24')
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

test('fromComponents', () => {
  const lt = LocalTime.fromComponents({ year: 1984, month: 6 })
  expect(lt.toISODate()).toBe('1984-06-01')
})

test('add edge', () => {
  // 2020-02-29 - 2020 year == 0000-02-29 00:00:00
  // expect(localTime('2020-02-29').add(-2020, 'year').toPretty()).toBe(dayjs('2020-02-29').add(-2020, 'year').toPretty())

  expect(localTime('2022-05-31').add(21, 'month').toPretty()).toBe('2024-02-29 00:00:00')

  expect(localTime('2022-05-31').add(1, 'month').toPretty()).toBe('2022-06-30 00:00:00')
  expect(localTime('2022-05-31').add(-1, 'month').toPretty()).toBe('2022-04-30 00:00:00')

  expect(localTime('2020-02-29').add(1, 'month').toPretty()).toBe('2020-03-29 00:00:00')
  expect(localTime('2020-03-29').add(-1, 'month').toPretty()).toBe('2020-02-29 00:00:00')
  expect(localTime('2020-03-30').add(-1, 'month').toPretty()).toBe('2020-02-29 00:00:00')
  expect(localTime('2020-03-31').add(-1, 'month').toPretty()).toBe('2020-02-29 00:00:00')
  expect(localTime('2020-01-31').add(1, 'month').toPretty()).toBe('2020-02-29 00:00:00')
  expect(localTime('2020-01-31').add(2, 'month').toPretty()).toBe('2020-03-31 00:00:00')
  expect(localTime('2020-01-31').add(3, 'month').toPretty()).toBe('2020-04-30 00:00:00')
  expect(localTime('2020-02-29').add(1, 'year').toPretty()).toBe('2021-02-28 00:00:00')
  expect(localTime('2021-02-28').add(-1, 'year').toPretty()).toBe('2020-02-28 00:00:00')
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
