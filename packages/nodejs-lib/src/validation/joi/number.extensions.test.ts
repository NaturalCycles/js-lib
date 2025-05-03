import { test } from 'vitest'
import { testValidation } from '../../test/validation.test.util.js'
import { Joi } from './joi.extensions.js'

test('dividable', () => {
  const schema = Joi.number().dividable(15)

  testValidation(schema, [0, 15, -15, 30, 45, 150, '15'], [1, 16, 'sdf', undefined, null, ''])
})
