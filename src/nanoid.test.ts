import { expect, test } from 'vitest'
import { nanoidBrowser, nanoidBrowserCustomAlphabet } from './nanoid'

const base64urlAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'

test('should return a string of required length', () => {
  const id = nanoidBrowser()
  expect(typeof id).toBe('string')
  expect(id.length).toBe(21)
  expectToMatchAlphabet(id, base64urlAlphabet)

  expect(nanoidBrowser(10).length).toBe(10)
  expect(nanoidBrowser(1).length).toBe(1)
  expect(nanoidBrowser(8).length).toBe(8)
  expect(nanoidBrowser(256).length).toBe(256)
  expect(nanoidBrowser(300).length).toBe(300)
})

test('should be random, 2 values should not be equal', () => {
  expect(nanoidBrowser()).not.toBe(nanoidBrowser())
})

test('customAlphabet id all characters should be from the alphabet', () => {
  const alphabet = 'abcdefgh'
  const fn = nanoidBrowserCustomAlphabet(alphabet)
  let id = fn()
  expect(id.length).toBe(21)
  expectToMatchAlphabet(id, alphabet)

  id = fn(16)
  expect(id.length).toBe(16)
  expectToMatchAlphabet(id, alphabet)
})

function expectToMatchAlphabet(id: string, alphabet: string): void {
  const charSet = new Set(alphabet.split(''))
  id.split('').forEach(char => {
    expect(charSet.has(char)).toBe(true)
  })
}
