import { dayjs } from '@naturalcycles/time-lib'
import { _range } from '../array/range'
import { localTime, LocalTime, LocalTimeUnit } from './localTime'

const units: LocalTimeUnit[] = ['year', 'month', 'day', 'hour', 'minute', 'second']

test('basic', () => {
  const start = '2022-01-01'
  const lt = LocalTime.of(start)
  expect(lt.year()).toBe(2022)
  expect(lt.month()).toBe(1)
  expect(lt.day()).toBe(1)
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
    `"Cannot parse \\"abcd\\" into LocalTime"`,
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
    _range(1000).forEach(i => {
      expect(lt.add(i, unit).unix()).toBe(d.add(i, unit).unix())
      expect(lt.subtract(i, unit).unix()).toBe(d.subtract(i, unit).unix())
      expect(lt.add(i, unit).toISODateTime() + '+00:00').toBe(d.add(i, unit).format())
    })
  })
})

test('diff', () => {
  const start = '2022-01-01'
  const lt = LocalTime.of(start)
  const d = dayjs(start)

  units.forEach(unit => {
    units.forEach(unit2 => {
      _range(1000).forEach(i => {
        let diff = d.add(i, unit2).diff(d, unit)
        // console.log(`${start} plus ${i} ${unit2} - ${start} === ${diff} ${unit}`)
        expect(lt.add(i, unit2).diff(lt, unit)).toBe(diff)

        diff = d.diff(d.add(i, unit2), unit)
        // console.log(`${start} - ${start} plus ${i} ${unit2} === ${diff} ${unit}`)
        expect(lt.diff(lt.add(i, unit2), unit)).toBe(diff)
      })
    })
  })
})

test('timezone-full string', () => {
  const lt = LocalTime.of('2022-04-06T23:15:00+09:00')
  expect(lt.toPretty()).toBe('2022-04-06 23:15:00')
})
