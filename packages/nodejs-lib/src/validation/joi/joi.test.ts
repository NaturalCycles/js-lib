import { expectTypeOf, test } from 'vitest'
import type { JoiSchemaObject } from './joi.model.js'
import { numberSchema, objectSchema, stringSchema } from './joi.shared.schemas.js'
import { getValidationResult, validate } from './joi.validation.util.js'

interface ItemBM {
  id?: string
  updated?: number
}

interface ItemDBM {
  id: string
  updated: number
}

const itemBMSchemaObject: JoiSchemaObject<ItemBM> = {
  id: stringSchema.optional(),
  updated: numberSchema.optional(),
}

const itemBMSchema = objectSchema<ItemBM>({
  ...itemBMSchemaObject,
})

const itemDBMSchema = objectSchema<ItemDBM>({
  ...itemBMSchemaObject,
  id: stringSchema,
  updated: numberSchema,
})

test('joiSchemaObject', () => {
  validate({}, itemBMSchema)
  validate(
    {
      id: 'id',
      updated: 1,
    },
    itemDBMSchema,
  )
})

test('validate type inference', () => {
  const r = validate({} as any, itemBMSchema)
  expectTypeOf(r).toEqualTypeOf<ItemBM>()

  const { value } = getValidationResult({} as any, itemBMSchema)
  expectTypeOf(value).toEqualTypeOf<ItemBM>()
})
