import { expect, test } from 'vitest'
import { _yargs } from './yargs.util'

test('_yargs', () => {
  expect(typeof _yargs.options).toBe('function')
})
