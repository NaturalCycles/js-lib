import { StringMap } from '../types'

// eslint-disable-next-line unused-imports/no-unused-vars
export type JsonSchema<T = any> =
  | JsonSchemaAny<T>
  | JsonSchemaRef<T>
  | JsonSchemaConst
  | JsonSchemaEnum
  | JsonSchemaString
  | JsonSchemaNumber
  | JsonSchemaBoolean
  | JsonSchemaNull
  | JsonSchemaObject<T>
  | JsonSchemaArray<T>
  | JsonSchemaTuple<T>

export interface JsonSchemaAny<T = any> {
  $schema?: string
  $id?: string
  title?: string
  description?: string
  // $comment?: string
  // nullable?: boolean // not sure about that field
  deprecated?: boolean
  readOnly?: boolean
  writeOnly?: boolean

  type?: string

  default?: T

  // union type
  oneOf?: JsonSchema[]
  // intersection type
  allOf?: JsonSchema[]
  // other types
  anyOf?: JsonSchema[]
  not?: JsonSchema

  // https://json-schema.org/understanding-json-schema/reference/conditionals.html#id6
  if?: JsonSchema
  then?: JsonSchema
  else?: JsonSchema

  /**
   * This is a temporary "intermediate AST" field that is used inside the parser.
   * In the final schema this field will NOT be present.
   */
  optionalField?: true
}

export interface JsonSchemaConst<T extends string | number | boolean = any>
  extends JsonSchemaAny<T> {
  const: T // literal type
}

export interface JsonSchemaString extends JsonSchemaAny<string> {
  type: 'string'
  pattern?: string
  minLength?: number
  maxLength?: number
  format?: string

  contentMediaType?: string
  contentEncoding?: string // e.g 'base64'

  /**
   * https://ajv.js.org/packages/ajv-keywords.html#transform
   */
  transform?: ('trim' | 'toLowerCase' | 'toUpperCase')[]
}

export interface JsonSchemaNumber extends JsonSchemaAny<number> {
  type: 'number' | 'integer'
  format?: string
  multipleOf?: number
  minimum?: number
  exclusiveMinimum?: number
  maximum?: number
  exclusiveMaximum?: number
}

export interface JsonSchemaBoolean extends JsonSchemaAny<boolean> {
  type: 'boolean'
}

export interface JsonSchemaNull extends JsonSchemaAny<null> {
  type: 'null'
}

export interface JsonSchemaEnum<T extends string | number = any> extends JsonSchemaAny<T> {
  enum: T[]
}

export interface JsonSchemaRef<T = any> extends JsonSchemaAny<T> {
  $ref: string
}

export interface JsonSchemaObject<T extends Record<any, any> = any> extends JsonSchemaAny<T> {
  type: 'object'
  // let's be strict and require all these
  properties: {
    [k in keyof T]: JsonSchema
  }
  required: (keyof T)[]
  additionalProperties: boolean
  minProperties?: number
  maxProperties?: number

  // StringMap
  patternProperties?: StringMap<JsonSchema>
  propertyNames?: JsonSchema

  /**
   * @example
   *
   * dependentRequired: {
   *   credit_card: ['billing_address']
   * }
   */
  dependentRequired?: StringMap<string[]>

  dependentSchemas?: StringMap<JsonSchema>

  dependencies?: StringMap<string[]>
}

export interface JsonSchemaArray<ITEM = any> extends JsonSchemaAny<ITEM[]> {
  type: 'array'
  items: JsonSchema<ITEM>
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean
}

export interface JsonSchemaTuple<T = any> extends JsonSchemaAny<T> {
  type: 'array'
  items: JsonSchema[]
  minItems: number
  maxItems: number
}
