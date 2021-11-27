import { _seq } from '../seq/seq'
import { END } from '../types'
import { _gb, _hb, _hc, _kb, _mb } from './size.util'

test('_hb', () => {
  expect(_hb()).toBe('0 byte')
  expect(_hb(0)).toBe('0 byte')
  expect(_hb(500)).toBe('500 byte')
  expect(_hb(1000)).toBe('1000 byte')
  expect(_hb(1024)).toBe('1.00 Kb')
  expect(_hb(1025)).toBe('1.00 Kb')
  expect(_hb(1024 ** 2)).toBe('1.00 Mb')
  expect(_hb(1024 ** 3)).toBe('1.00 Gb')
  expect(_kb(1000)).toBe(1)
  expect(_mb(1024 ** 2)).toBe(1)
  expect(_gb(1024 ** 3)).toBe(1)
})

test('_hb log', () => {
  _seq(2, n => (n < 10 ** 20 ? n * 11 : END)).forEach(n => {
    console.log(`${n}: ${_hb(n)}`)
  })
})

test('_hc log', () => {
  _seq(2, n => (n < 10 ** 20 ? n * 11 : END)).forEach(n => {
    console.log(`${n}: ${_hc(n)}`)
  })
})
