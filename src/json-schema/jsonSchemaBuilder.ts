import { _uniq } from '../array/array.util'
import {
  BaseDBEntity,
  JsonSchemaArray,
  JsonSchemaTuple,
  mergeJsonSchemaObjects,
  SavedDBEntity,
  _deepCopy,
} from '../index'
import { StringMap } from '../types'
import {
  JsonSchema,
  JsonSchemaAny,
  JsonSchemaBoolean,
  JsonSchemaConst,
  JsonSchemaEnum,
  JsonSchemaNull,
  JsonSchemaNumber,
  JsonSchemaObject,
  JsonSchemaRef,
  JsonSchemaString,
} from './jsonSchema.model'

/* eslint-disable id-blacklist, @typescript-eslint/explicit-module-boundary-types */

/**
 * Fluent (chainable) API to manually create Json Schemas.
 * Inspired by Joi
 */
export const jsonSchema = {
  any: (p?: Partial<JsonSchema>) => new JsonSchemaAnyBuilder(p),
  const: <T extends string | number | boolean>(value: T, p?: Partial<JsonSchema>) =>
    new JsonSchemaConstBuilder(value, p),
  ref: <T = any>($ref: string, p?: Partial<JsonSchema>) => new JsonSchemaRefBuilder<T>($ref, p),
  enum: <T extends number | string>(enumValues: T[], p?: Partial<JsonSchema>) =>
    new JsonSchemaEnumBuilder<T>(enumValues, p),
  boolean: () => new JsonSchemaBooleanBuilder(),
  null: () => new JsonSchemaNullBuilder(),
  // // number types
  number: () => new JsonSchemaNumberBuilder(),
  integer: () => new JsonSchemaNumberBuilder().integer(),
  unixTimestamp: () => new JsonSchemaNumberBuilder().unixTimestamp(),
  // // string types
  string: () => new JsonSchemaStringBuilder(),
  dateString: () => new JsonSchemaStringBuilder().date(),
  // email: () => new JsonSchemaStringBuilder().email(),
  // complex types
  rootObject: <T extends Record<any, any>>(
    props: {
      [k in keyof T]: JsonSchemaAnyBuilder<T[k]>
    },
  ) => new JsonSchemaObjectBuilder<T>().addProperties(props).$schemaDraft7(),
  object: <T extends Record<any, any>>(
    props: {
      [k in keyof T]: JsonSchemaAnyBuilder<T[k]>
    },
  ) => new JsonSchemaObjectBuilder<T>().addProperties(props),
  array: <ITEM = any>(items: JsonSchema<ITEM>) => new JsonSchemaArrayBuilder<ITEM>(items),
  tuple: <T = any>(items: JsonSchema[]) => new JsonSchemaTupleBuilder<T>(items),
}

export class JsonSchemaAnyBuilder<T = any> implements JsonSchemaAny<T> {
  constructor(p: Partial<JsonSchema> = {}) {
    Object.assign(this, {
      ...p,
    })
  }

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

  set$schema = ($schema: string): this => Object.assign(this, { $schema })
  $schemaDraft7 = () => this.set$schema('http://json-schema.org/draft-07/schema#')
  set$id = ($id: string): this => Object.assign(this, { $id })
  setTitle = (title: string): this => Object.assign(this, { title })
  setDescription = (description: string): this => Object.assign(this, { description })
  setDeprecated = (deprecated = true): this => Object.assign(this, { deprecated })
  setType = (type: string): this => Object.assign(this, { type })
  setDefault = (v: any): this => Object.assign(this, { default: v })
  setOneOf = (schemas: JsonSchema[]): this => Object.assign(this, { oneOf: schemas })
  setAllOf = (schemas: JsonSchema[]): this => Object.assign(this, { allOf: schemas })

  optional = (optional = true): this => {
    if (optional) {
      this.optionalField = true
    } else {
      delete this.optionalField
    }
    return this
  }

  /**
   * Produces a "clean schema object" without methods.
   * Same as if it would be JSON.stringified.
   * Completely not necessary, but can be used for pretty-printing.
   */
  build = (): JsonSchemaAny<T> => _deepCopy(this)
}

export class JsonSchemaNullBuilder extends JsonSchemaAnyBuilder<null> implements JsonSchemaNull {
  constructor(p: JsonSchemaAny = {}) {
    super({
      type: 'null',
      ...p,
    })
  }

  override type!: 'null'
}

export class JsonSchemaConstBuilder<T extends string | number | boolean>
  extends JsonSchemaAnyBuilder<T>
  implements JsonSchemaConst<T>
{
  constructor(value: T, p: JsonSchemaAny = {}) {
    super({
      const: value,
      ...p,
    })
  }

  const!: T
}

export class JsonSchemaRefBuilder<T> extends JsonSchemaAnyBuilder<T> implements JsonSchemaRef<T> {
  constructor($ref: string, p: JsonSchemaAny = {}) {
    super({
      $ref,
      ...p,
    })
  }

  $ref!: string
}

export class JsonSchemaEnumBuilder<T extends number | string>
  extends JsonSchemaAnyBuilder<T>
  implements JsonSchemaEnum<T>
{
  constructor(enumValues: T[], p: JsonSchemaAny = {}) {
    super({
      enum: enumValues,
      ...p,
    })
  }

  enum!: T[]
}

export class JsonSchemaBooleanBuilder
  extends JsonSchemaAnyBuilder<boolean>
  implements JsonSchemaBoolean
{
  constructor(p: JsonSchemaAny = {}) {
    super({
      type: 'boolean',
      ...p,
    })
  }

  override type!: 'boolean'
}

export class JsonSchemaNumberBuilder
  extends JsonSchemaAnyBuilder<number>
  implements JsonSchemaNumber
{
  constructor(p: JsonSchemaAny = {}) {
    super({
      type: 'number',
      ...p,
    })
  }

  override type!: 'number' | 'integer'

  format?: string
  multipleOf?: number
  minimum?: number
  exclusiveMinimum?: number
  maximum?: number
  exclusiveMaximum?: number

  integer = (): this => Object.assign(this, { type: 'integer' })

  setMultipleOf = (multipleOf: number): this => Object.assign(this, { multipleOf })
  setMinimum = (minimum: number): this => Object.assign(this, { minimum })
  min = (minimum: number): this => Object.assign(this, { minimum })
  setExclusiveMinimum = (exclusiveMinimum: number): this =>
    Object.assign(this, { exclusiveMinimum })
  setMaximum = (maximum: number): this => Object.assign(this, { maximum })
  max = (maximum: number): this => Object.assign(this, { maximum })
  setExclusiveMaximum = (exclusiveMaximum: number): this =>
    Object.assign(this, { exclusiveMaximum })
  range = (minimum: number, maximum: number): this => Object.assign(this, { minimum, maximum })

  setFormat = (format: string): this => Object.assign(this, { format })

  int32 = () => this.setFormat('int32')
  int64 = () => this.setFormat('int64')
  float = () => this.setFormat('float')
  double = () => this.setFormat('double')
  unixTimestamp = () => this.setFormat('unixTimestamp')
  unixTimestampMillis = () => this.setFormat('unixTimestampMillis')
  utcOffset = () => this.setFormat('utcOffset')
  utcOffsetHours = () => this.setFormat('utcOffsetHours')
}

export class JsonSchemaStringBuilder
  extends JsonSchemaAnyBuilder<string>
  implements JsonSchemaString
{
  constructor(p: JsonSchemaAny = {}) {
    super({
      type: 'string',
      ...p,
    })
  }

  override type!: 'string'

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

  setPattern = (pattern: string): this => Object.assign(this, { pattern })
  setMinLength = (minLength: number): this => Object.assign(this, { minLength })
  min = (minLength: number): this => Object.assign(this, { minLength })
  setMaxLength = (maxLength: number): this => Object.assign(this, { maxLength })
  max = (maxLength: number): this => Object.assign(this, { maxLength })
  length = (minLength: number, maxLength: number): this =>
    Object.assign(this, { minLength, maxLength })

  setFormat = (format: string): this => Object.assign(this, { format })

  email = () => this.setFormat('email')
  date = () => this.setFormat('date')
  url = () => this.setFormat('url')
  ipv4 = () => this.setFormat('ipv4')
  ipv6 = () => this.setFormat('ipv6')
  password = () => this.setFormat('password')
  id = () => this.setFormat('id')
  slug = () => this.setFormat('slug')
  semVer = () => this.setFormat('semVer')
  languageTag = () => this.setFormat('languageTag')
  countryCode = () => this.setFormat('countryCode')
  currency = () => this.setFormat('currency')

  trim = (trim = true) => this.transformModify('trim', trim)
  toLowerCase = (toLowerCase = true) => this.transformModify('toLowerCase', toLowerCase)
  toUpperCase = (toUpperCase = true) => this.transformModify('toUpperCase', toUpperCase)

  private transformModify(t: 'trim' | 'toLowerCase' | 'toUpperCase', add: boolean): this {
    if (add) {
      this.transform = _uniq([...(this.transform || []), t])
    } else {
      this.transform = this.transform?.filter(s => s !== t)
    }
    return this
  }

  // contentMediaType?: string
  // contentEncoding?: string
}

export class JsonSchemaObjectBuilder<T extends Record<any, any>>
  extends JsonSchemaAnyBuilder<T>
  implements JsonSchemaObject<T>
{
  constructor(p: JsonSchemaAny = {}) {
    super({
      type: 'object',
      properties: {},
      required: [],
      additionalProperties: false,
      ...p,
    })
  }

  override type!: 'object'

  properties!: { [k in keyof T]: JsonSchema }
  required!: (keyof T)[]
  additionalProperties!: boolean
  minProperties?: number
  maxProperties?: number

  // StringMap
  patternProperties?: StringMap<JsonSchema>
  propertyNames?: JsonSchema

  dependentRequired?: StringMap<string[]>
  dependentSchemas?: StringMap<JsonSchema>
  dependencies?: StringMap<string[]>

  addProperties(props: { [k in keyof T]: JsonSchemaAnyBuilder<T[k]> }): this {
    Object.entries(props).forEach(([k, schema]: [keyof T, JsonSchemaAnyBuilder]) => {
      if (!schema.optionalField) {
        this.required.push(k)
      } else {
        delete schema.optionalField
      }
      this.properties[k] = _deepCopy(schema)
    })

    this.required = _uniq(this.required)

    return this
  }

  setRequired = (required: (keyof T)[]): this => Object.assign(this, { required })
  addRequired = (required: (keyof T)[]): this =>
    Object.assign(this, { required: _uniq([...this.required, ...required]) })

  setMinProperties = (minProperties: number): this => Object.assign(this, { minProperties })
  minProps = (minProperties: number): this => Object.assign(this, { minProperties })
  setMaxProperties = (maxProperties: number): this => Object.assign(this, { maxProperties })
  maxProps = (maxProperties: number): this => Object.assign(this, { maxProperties })
  setAdditionalProperties = (additionalProperties: boolean): this =>
    Object.assign(this, { additionalProperties })
  additionalProps = (additionalProperties: boolean): this =>
    Object.assign(this, { additionalProperties })

  baseDBEntity(): JsonSchemaObjectBuilder<T & BaseDBEntity> {
    Object.assign(this.properties, {
      id: { type: 'string' },
      created: { type: 'number', format: 'unixTimestamp' },
      updated: { type: 'number', format: 'unixTimestamp' },
    })

    return this
  }

  savedDBEntity(): JsonSchemaObjectBuilder<T & SavedDBEntity> {
    return this.baseDBEntity().addRequired(['id', 'created', 'updated']) as any
  }

  override build = (): JsonSchemaObject<T> => _deepCopy(this)

  clone(): JsonSchemaObjectBuilder<T> {
    return new JsonSchemaObjectBuilder<T>(_deepCopy(this))
  }

  extend<T2>(s2: JsonSchemaObject<T2>): JsonSchemaObjectBuilder<T & T2> {
    return new JsonSchemaObjectBuilder<T & T2>(mergeJsonSchemaObjects(_deepCopy(this), s2))
  }
}

export class JsonSchemaArrayBuilder<ITEM = any>
  extends JsonSchemaAnyBuilder<ITEM[]>
  implements JsonSchemaArray<ITEM>
{
  constructor(items: JsonSchema<ITEM>, p: JsonSchemaAny = {}) {
    super({
      type: 'array',
      items,
      ...p,
    })
  }

  override type!: 'array'

  items!: JsonSchema<ITEM>
  minItems?: number
  maxItems?: number
  uniqueItems?: boolean

  setMinItems = (minItems: number): this => Object.assign(this, { minItems })
  min = (minItems: number): this => Object.assign(this, { minItems })
  setMaxItems = (maxItems: number): this => Object.assign(this, { maxItems })
  max = (maxItems: number): this => Object.assign(this, { maxItems })
  setUniqueItems = (uniqueItems: number): this => Object.assign(this, { uniqueItems })
  unique = (uniqueItems: number): this => Object.assign(this, { uniqueItems })
}

export class JsonSchemaTupleBuilder<T = any>
  extends JsonSchemaAnyBuilder<T>
  implements JsonSchemaTuple<T>
{
  constructor(items: JsonSchema[], p: JsonSchemaAny = {}) {
    super({
      type: 'array',
      items,
      minItems: items.length,
      maxItems: items.length,
      ...p,
    })
  }

  override type!: 'array'

  items!: JsonSchema[]
  minItems!: number
  maxItems!: number
}
