import { expect, test } from 'vitest'
import { _range } from '../index'
import { _createDeterministicRandom } from './createDeterministicRandom'

test('_createDeterministicRandom', () => {
  let deterministicRandom = _createDeterministicRandom()
  let numbers = _range(30).map(() => deterministicRandom())
  expect(numbers[0]).toBe(0.9872818551957607)

  deterministicRandom = _createDeterministicRandom()
  numbers = _range(30).map(() => deterministicRandom())
  expect(numbers[0]).toBe(0.9872818551957607)
})
