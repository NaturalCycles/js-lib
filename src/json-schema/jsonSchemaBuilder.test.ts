import { BaseDBEntity } from '../types'
import { jsonSchema } from './jsonSchemaBuilder'
import { baseDBEntityJsonSchema, savedDBEntityJsonSchema } from './jsonSchemas'

interface Address {
  countryCode: string
  zip: string
  city: string
  address1: string
  address2?: string
  region?: string
  phone?: string
}

// interface AddressBM extends Address, BaseDBEntity {}
// interface AddressDBM extends Address, SavedDBEntity {}

const addressJsonSchema = jsonSchema
  .object<Address>({
    countryCode: jsonSchema.string().countryCode(),
    zip: jsonSchema.string().minLength(1).maxLength(40),
    city: jsonSchema.string(),
    address1: jsonSchema.string(),
    address2: jsonSchema.string().optional(),
    region: jsonSchema.string().optional(),
    phone: jsonSchema.string().optional(),
  })
  .build()

const addressBMJsonSchema = addressJsonSchema.extendWithSchema(baseDBEntityJsonSchema)
const addressDBMJsonSchema = addressJsonSchema.extendWithSchema(savedDBEntityJsonSchema)

// alternative

const addressBMJsonSchema2 = baseDBEntityJsonSchema.extendWithSchema(addressJsonSchema)
const addressDBMJsonSchema2 = savedDBEntityJsonSchema.extendWithSchema(addressJsonSchema)

// alternative 2
const addressBMJsonSchema3 = addressJsonSchema.extendWithProps<BaseDBEntity>({
  id: jsonSchema.string().optional(),
  created: jsonSchema.unixTimestamp().optional(),
  updated: jsonSchema.unixTimestamp().optional(),
})

test('simpleStringSchema', () => {
  const s = jsonSchema.string().build()

  expect(s).toMatchInlineSnapshot(`
Object {
  "type": "string",
}
`)
})

test('addressSchema', () => {
  expect(addressJsonSchema).toMatchSnapshot()
})

test('addressBMJsonSchema', () => {
  expect(addressBMJsonSchema).toMatchSnapshot()
  expect(addressBMJsonSchema2).toEqual(addressBMJsonSchema)
  expect(addressBMJsonSchema3).toEqual(addressBMJsonSchema)
})

test('addressDBMJsonSchema', () => {
  addressDBMJsonSchema.required.sort()
  addressDBMJsonSchema2.required.sort()

  expect(addressDBMJsonSchema).toMatchSnapshot()
  expect(addressDBMJsonSchema2).toEqual(addressDBMJsonSchema)
})
