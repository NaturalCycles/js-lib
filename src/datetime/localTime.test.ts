import { dayjs } from '@naturalcycles/time-lib'
import { _range } from '../array/range'
import { localTime, LocalTime, LocalTimeUnit } from './localTime'

const units: LocalTimeUnit[] = ['year', 'month', 'day', 'hour', 'minute', 'second']

test('basic', () => {
  const start = '2022-01-01'
  const lt = LocalTime.of(start)
  expect(lt.year()).toBe(2022)
  expect(lt.month()).toBe(1)
  expect(lt.date()).toBe(1)
  expect(lt.toISO8601()).toBe('2022-01-01T00:00:00')
  expect(lt.toPretty()).toBe('2022-01-01 00:00:00')
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
})

test('validation', () => {
  expect(() => localTime('abcd')).toThrowErrorMatchingInlineSnapshot(
    `"Cannot parse \\"abcd\\" into LocalTime"`,
  )
})

test('add', () => {
  const start = '2022-01-01'
  const lt = LocalTime.of(start)
  const d = dayjs(start)

  units.forEach(unit => {
    _range(1000).forEach(i => {
      expect(lt.add(i, unit).unix()).toBe(d.add(i, unit).unix())
      expect(lt.add(i, unit).toISO8601() + '+00:00').toBe(d.add(i, unit).format())
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
