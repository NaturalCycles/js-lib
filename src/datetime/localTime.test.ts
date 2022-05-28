import { dayjs } from '@naturalcycles/time-lib'
import { _range } from '../array/range'
import { ISODayOfWeek, localTime, LocalTime, LocalTimeFormatter, LocalTimeUnit } from './localTime'

const units: LocalTimeUnit[] = ['year', 'month', 'day', 'hour', 'minute', 'second', 'week']

test('basic', () => {
  const start = '2022-01-01'
  const lt = LocalTime.of(start)
  expect(lt.year()).toBe(2022)
  expect(lt.month()).toBe(1)
  expect(lt.day()).toBe(1)
  expect(lt.week()).toBe(52)
  expect(lt.toISODateTime()).toBe('2022-01-01T00:00:00')
  expect(lt.toPretty()).toBe('2022-01-01 00:00:00')
  expect(lt.toPretty(false)).toBe('2022-01-01 00:00')
  expect(lt.unix()).toBe(1640995200)
  expect(lt.valueOf()).toBe(1640995200)
  expect(lt.toJSON()).toBe(1640995200)
  expect(lt.toString()).toBe('1640995200')
  const lt2 = lt.clone()
  expect(lt2).not.toBe(lt)
  expect(lt2 === lt).toBe(false)
  expect(lt.isSame(lt2)).toBe(true)
  expect(lt.isAfter(lt2)).toBe(false)
  expect(lt.isBefore(lt2)).toBe(false)
  expect(lt.isSameOrAfter(lt2)).toBe(true)
  expect(lt.isSameOrBefore(lt2)).toBe(true)
  expect(lt.cmp(lt2)).toBe(0)

  expect(lt.year(2023).year()).toBe(2023)
  expect(lt.year()).toBe(2022) // not changed

  expect(lt.toISODate()).toBe('2022-01-01')
  expect(lt.toISOTime()).toBe('00:00:00')
  expect(lt.toISOTime(false)).toBe('00:00')
  expect(lt.toStringCompact()).toBe('20220101_0000')
  expect(lt.toStringCompact(true)).toBe('20220101_000000')

  expect(lt.toLocalDate().toString()).toBe('2022-01-01')

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
  const start = '2022-01-01'
  const lt = LocalTime.of(start)
  const d = dayjs(start)

  units.forEach(unit => {
    _range(3000).forEach(i => {
      expect(lt.add(i, unit).unix()).toBe(d.add(i, unit).unix())
      expect(lt.subtract(i, unit).unix()).toBe(d.subtract(i, unit).unix())
      expect(lt.add(i, unit).toISODateTime() + '+00:00').toBe(d.add(i, unit).format())

      units.forEach(unit2 => {
        // console.log(unit2, lt.add(i, unit).startOf(unit2).toPretty(), d.add(i, unit).startOf(unit2).toPretty())
        // expect(lt.add(i, unit).startOf(unit2).unix()).toBe(d.add(i, unit).startOf(unit2).unix())
        expect(lt.add(i, unit).startOf(unit2).unix()).toBe(d.add(i, unit).startOf(unit2).unix())
        expect(lt.add(i, unit).endOf(unit2).unix()).toBe(d.add(i, unit).endOf(unit2).unix())

        expect(lt.add(i, unit).add(40, 'day').startOf(unit2).unix()).toBe(
          d.add(i, unit).add(40, 'day').startOf(unit2).unix(),
        )
      })
    })
  })
})

test('diff', () => {
  const start = '2022-01-01'
  const lt = LocalTime.of(start)
  const d = dayjs(start)

  // const units: LocalTimeUnit[] = ['week']

  units.forEach(unit => {
    units.forEach(unit2 => {
      _range(unit === 'year' ? 1000 : 5000).forEach(i => {
        let diff = lt.add(i, unit2).diff(lt, unit)
        let expected = d.add(i, unit2).diff(d, unit)
        // console.log(`${start} + ${i} ${unit2} == ${lt.add(i, unit2).toPretty()} should diff ${expected} ${unit}`)
        expect(diff).toBe(expected)

        diff = lt.diff(lt.add(i, unit2), unit)
        expected = d.diff(d.add(i, unit2), unit)
        // console.log(`${start} - ${start} plus ${i} ${unit2} === ${diff} ${unit}`)
        expect(diff).toBe(expected)

        diff = lt.diff(lt.add(-i, unit2), unit)
        expected = d.diff(d.add(-i, unit2), unit)
        // console.log(`${start} - ${i} ${unit2} == ${lt.add(-i, unit2).toPretty()} should diff ${expected} ${unit}`)
        expect(diff).toBe(expected)
      })
    })
  })
})

test('timezone-full string', () => {
  const lt = LocalTime.of('2022-04-06T23:15:00+09:00')
  expect(lt.toPretty()).toBe('2022-04-06 23:15:00')
})

test('startOf should have 0 millis', () => {
  const t = localTime().startOf('day')
  expect(t.getDate().getMilliseconds()).toBe(0)
  expect(t.getDate().getSeconds()).toBe(0)
  expect(t.getDate().getMinutes()).toBe(0)
  expect(t.getDate().getHours()).toBe(0)
})

test('format', () => {
  const fmt: LocalTimeFormatter = ld => `${ld.year()}-${String(ld.month()).padStart(2, '0')}`
  expect(localTime('1984-06-21').format(fmt)).toBe('1984-06')
})

test('dayOfWeek', () => {
  const t = localTime('1984-06-21')
  expect(t.dayOfWeek()).toBe(ISODayOfWeek.THURSDAY)

  expect(() => t.dayOfWeek(-1)).toThrowErrorMatchingInlineSnapshot(`"Invalid dayOfWeek: -1"`)
  expect(() => t.dayOfWeek(0)).toThrowErrorMatchingInlineSnapshot(`"Invalid dayOfWeek: 0"`)
  expect(() => t.dayOfWeek(8)).toThrowErrorMatchingInlineSnapshot(`"Invalid dayOfWeek: 8"`)
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
