import { expect, test } from 'vitest'
import { _slugify } from './slugify'

test.each([
  ['', ''],
  ['Hello World', 'hello-world'],
  ['Klättermusen 2', 'klattermusen-2'],
  ["Moe's Tavern", 'moes-tavern'],
  ['Åhléns', 'ahlens'],
])(`slugify %s => %s`, (input, expected) => {
  expect(_slugify(input)).toBe(expected)
})
