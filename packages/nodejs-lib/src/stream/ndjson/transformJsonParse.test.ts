import { expect, test } from 'vitest'
import { bufferReviver } from './transformJsonParse.js'

test.todo('transformJsonParse')

test('bufferReviver', () => {
  const s = 'Hello World 1'
  const b = Buffer.from(s)

  const b2 = JSON.parse(JSON.stringify(b), bufferReviver)
  expect(b2).toEqual(b)
  expect(b2.toString()).toBe(s)
})
