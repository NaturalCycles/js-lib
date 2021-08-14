import { StringMap, _deepCopy, _mapValues, _omit, _uniq } from '../index'
import {
  JsonSchema,
  JsonSchemaAny,
  JsonSchemaArray,
  JsonSchemaConst,
  JsonSchemaEnum,
  JsonSchemaNull,
  JsonSchemaNumber,
  JsonSchemaObject,
  JsonSchemaRef,
  JsonSchemaString,
  JsonSchemaTuple,
} from './jsonSchema.model'
import { mergeJsonSchemaObjects } from './jsonSchema.util'

/* eslint-disable id-blacklist, @typescript-eslint/explicit-module-boundary-types */

export class JsonSchemaObjectExtendable<T extends Record<any, any> = any>
  implements JsonSchemaObject<T>
{
  constructor(part: JsonSchemaObject<T>) {
    Object.assign(this, {
      ...part,
    })
  }

  type!: 'object'

  properties!: {
    [k in keyof T]: JsonSchema
  }

  additionalProperties!: boolean
  required!: (keyof T)[]

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

  /**
   * Does not mutate, returns new builder.
   */
  extendWithSchema<T2>(
    schema: JsonSchemaObject<T2> | JsonSchemaObjectBuilder<T2>,
  ): JsonSchemaObjectExtendable<T & T2> {
    const s2: JsonSchemaObject<T2> =
      schema instanceof JsonSchemaObjectBuilder ? schema.build() : schema
    return mergeJsonSchemaObjects(_deepCopy(this), s2) as JsonSchemaObjectExtendable<T & T2>
  }

  extendWithProps<T2 extends Record<any, any>>(
    props: {
      [k in keyof Partial<T2>]: JsonSchemaAnyBuilder<T2[k]>
    },
  ): JsonSchemaObjectExtendable<T & T2> {
    return this.extendWithSchema(new JsonSchemaObjectBuilder<T2>(props).build())
  }
}

/**
 * Fluent (chainable) API to manually create Json Schemas.
 * Inspired by Joi
 */
export const jsonSchema = {
  any: () => new JsonSchemaAnyBuilder(),
  const: <T extends string | number | boolean>(v: T) => new JsonSchemaConstBuilder(v),
  ref: <T = any>($ref: string) => new JsonSchemaRefBuilder<T>($ref),
  enum: <T extends number | string>(values: T[]) => new JsonSchemaEnumBuilder<T>(values),
  boolean: () => new JsonSchemaAnyBuilder<boolean>().type('boolean'),
  null: () => new JsonSchemaNullBuilder(),
  // number types
  number: () => new JsonSchemaNumberBuilder(),
  integer: () => new JsonSchemaNumberBuilder().integer(),
  unixTimestamp: () => new JsonSchemaNumberBuilder().unixTimestamp(),
  // string types
  string: () => new JsonSchemaStringBuilder(),
  dateString: () => new JsonSchemaStringBuilder().date(),
  // email: () => new JsonSchemaStringBuilder().email(),
  // complex types
  object: <T extends Record<any, any>>(
    props: {
      [k in keyof Partial<T>]: JsonSchemaAnyBuilder
    },
  ) => new JsonSchemaObjectBuilder<T>(props),
  array: <ITEM = any>(items: JsonSchemaAnyBuilder<ITEM>) => new JsonSchemaArrayBuilder<ITEM>(items),
  tuple: <T = any>(items: JsonSchemaAnyBuilder[]) => new JsonSchemaTupleBuilder<T>(items),
}

export class JsonSchemaAnyBuilder<T = any> {
  constructor(part?: JsonSchemaAny<T>) {
    this.p = {
      // $schema: 'http://json-schema.org/draft-07/schema#',
      // We follow "required by default" pattern
      requiredField: true,
      ...part,
    }
  }

  protected p: JsonSchemaAny<T>

  build(): JsonSchemaAny<T> {
    // Return "clean" json schema, without custom `requiredField` property
    return _omit(this.p, ['requiredField'])
  }

  $schema($schema: string): this {
    Object.assign(this.p, { $schema })
    return this
  }

  $schemaDraft7 = () => this.$schema('http://json-schema.org/draft-07/schema#')

  $id($id: string): this {
    Object.assign(this.p, { $id })
    return this
  }

  title(title: string): this {
    Object.assign(this.p, { title })
    return this
  }

  description(description: string): this {
    Object.assign(this.p, { description })
    return this
  }

  deprecated(deprecated = true): this {
    Object.assign(this.p, { deprecated })
    return this
  }

  default(v: any): this {
    Object.assign(this.p, { default: v })
    return this
  }

  // readOnly?: boolean
  // writeOnly?: boolean

  type(type: string): this {
    Object.assign(this.p, { type })
    return this
  }

  /**
   * Union type (|)
   */
  oneOf(oneOf: JsonSchemaAnyBuilder[]): this {
    this.p.oneOf = oneOf.map(s => s.build())
    return this
  }

  /**
   * Intersection type (&)
   */
  allOf(allOf: JsonSchemaAnyBuilder[]): this {
    this.p.allOf = allOf.map(s => s.build())
    return this
  }

  // // https://json-schema.org/understanding-json-schema/reference/conditionals.html#id6
  // if?: JsonSchema
  // then?: JsonSchema
  // else?: JsonSchema

  const(v: string | number | boolean): this {
    Object.assign(this.p, {
      const: v,
    })
    return this
  }

  optional(): this {
    this.p.requiredField = false
    return this
  }

  required(): this {
    this.p.requiredField = true
    return this
  }
}

export class JsonSchemaStringBuilder extends JsonSchemaAnyBuilder<string> {
  protected override p: JsonSchemaString = {
    type: 'string',
    // We follow "required by default" pattern
    requiredField: true,
  }

  pattern(pattern: string): this {
    Object.assign(this.p, { pattern })
    return this
  }

  minLength(minLength: number): this {
    Object.assign(this.p, { minLength })
    return this
  }

  maxLength(maxLength: number): this {
    Object.assign(this.p, { maxLength })
    return this
  }

  format(format: string): this {
    Object.assign(this.p, { format })
    return this
  }

  email = () => this.format('email')
  date = () => this.format('date')
  url = () => this.format('url')
  ipv4 = () => this.format('ipv4')
  ipv6 = () => this.format('ipv6')
  password = () => this.format('password')
  id = () => this.format('id')
  slug = () => this.format('slug')
  semVer = () => this.format('semVer')
  languageTag = () => this.format('languageTag')
  countryCode = () => this.format('countryCode')
  currency = () => this.format('currency')

  trim = (trim = true) => this.transformModify('trim', trim)
  toLowerCase = (toLowerCase = true) => this.transformModify('toLowerCase', toLowerCase)
  toUpperCase = (toUpperCase = true) => this.transformModify('toUpperCase', toUpperCase)

  private transformModify(t: 'trim' | 'toLowerCase' | 'toUpperCase', add: boolean): this {
    if (add) {
      this.p.transform = _uniq([...(this.p.transform || []), t])
    } else {
      this.p.transform = this.p.transform?.filter(s => s !== t)
    }
    return this
  }

  // contentMediaType?: string
  // contentEncoding?: string
}

export class JsonSchemaNumberBuilder extends JsonSchemaAnyBuilder<number> {
  protected override p: JsonSchemaNumber = {
    type: 'number',
    // We follow "required by default" pattern
    requiredField: true,
  }

  integer(): this {
    this.p.type = 'integer'
    return this
  }

  multipleOf(multipleOf: number): this {
    Object.assign(this.p, { multipleOf })
    return this
  }

  minimum(minimum: number): this {
    Object.assign(this.p, { minimum })
    return this
  }

  exclusiveMinimum(exclusiveMinimum: number): this {
    Object.assign(this.p, { exclusiveMinimum })
    return this
  }

  maximum(maximum: number): this {
    Object.assign(this.p, { maximum })
    return this
  }

  exclusiveMaximum(exclusiveMaximum: number): this {
    Object.assign(this.p, { exclusiveMaximum })
    return this
  }

  format(format: string): this {
    Object.assign(this.p, { format })
    return this
  }

  int32 = () => this.format('int32')
  int64 = () => this.format('int64')
  float = () => this.format('float')
  double = () => this.format('double')
  unixTimestamp = () => this.format('unixTimestamp')
  unixTimestampMillis = () => this.format('unixTimestampMillis')
  utcOffset = () => this.format('utcOffset')
  utcOffsetHours = () => this.format('utcOffsetHours')

  // range?
}

export class JsonSchemaObjectBuilder<
  T extends Record<any, any> = any,
> extends JsonSchemaAnyBuilder<T> {
  constructor(
    props: {
      [k in keyof Partial<T>]: JsonSchemaAnyBuilder<T[k]>
    },
  ) {
    super()

    this.p = {
      type: 'object',
      // We follow "required by default" pattern
      requiredField: true,
      additionalProperties: false,
      properties: {} as any,
      required: [],
    }

    Object.entries(props).forEach(([k, builder]) => {
      // hack - accessing "private" p object
      if (builder.p?.requiredField) this.p.required.push(k)
      const p = builder.build()
      ;(this.p.properties as any)[k] = p
    })
  }

  clone(): JsonSchemaObjectBuilder<T> {
    const b = new JsonSchemaObjectBuilder<T>({} as any)
    b.p = _deepCopy(this.p)
    return b
  }

  static create<T>(existingSchema: JsonSchemaObject<T>): JsonSchemaObjectBuilder<T> {
    const b = new JsonSchemaObjectBuilder<T>({} as any)
    b.p = existingSchema
    return b
  }

  protected override p: JsonSchemaObject<T>

  override build(): JsonSchemaObjectExtendable<T> {
    this.p.required = _uniq(this.p.required)
    // Return "clean" json schema, without custom `requiredField` property
    return new JsonSchemaObjectExtendable<T>(_omit(this.p, ['requiredField']))
  }

  additionalProperties(additionalProperties: boolean): this {
    Object.assign(this.p, { additionalProperties })
    return this
  }

  minProperties(minProperties: number): this {
    Object.assign(this.p, { minProperties })
    return this
  }

  maxProperties(maxProperties: number): this {
    Object.assign(this.p, { maxProperties })
    return this
  }

  patternProperties(patternProperties: StringMap<JsonSchemaAnyBuilder>): this {
    this.p.patternProperties = _mapValues(patternProperties, (_k, builder) => builder!.build())
    return this
  }

  propertyNames(propertyNames: JsonSchemaAnyBuilder): this {
    this.p.propertyNames = propertyNames.build()
    return this
  }

  baseDBEntity(): this {
    Object.assign(this.p.properties, {
      id: { type: 'string' },
      created: { type: 'number', format: 'unixTimestamp' },
      updated: { type: 'number', format: 'unixTimestamp' },
    })
    return this
  }

  savedDBEntity(): this {
    this.baseDBEntity()
    this.p.required.push('id', 'created', 'updated')
    return this
  }

  /**
   * Does not mutate, returns new builder instance.
   */
  extendWithSchema<T2>(
    schema: JsonSchemaObjectBuilder<T2> | JsonSchemaObject<T2>,
  ): JsonSchemaObjectBuilder<T & T2> {
    const s1 = this.clone()
    const s2: JsonSchemaObject<T2> =
      schema instanceof JsonSchemaObjectBuilder ? schema.build() : schema
    mergeJsonSchemaObjects(s1.p, s2)
    return s1
  }

  extendWithProps<T2 extends Record<any, any>>(
    props: {
      [k in keyof Partial<T2>]: JsonSchemaAnyBuilder<T2[k]>
    },
  ): JsonSchemaObjectBuilder<T & T2> {
    return this.extendWithSchema(new JsonSchemaObjectBuilder<T2>(props).build())
  }
}

export class JsonSchemaArrayBuilder<ITEM = any> extends JsonSchemaAnyBuilder<ITEM[]> {
  constructor(
    items: JsonSchemaAnyBuilder<ITEM> | JsonSchemaAny<ITEM>,
    part?: Partial<JsonSchemaArray<ITEM>>,
  ) {
    super()
    this.p = {
      type: 'array',
      items: items instanceof JsonSchemaAnyBuilder ? items.build() : items,
      ...part,
    }
  }

  protected override p: JsonSchemaArray

  minItems(minItems: number): this {
    Object.assign(this.p, { minItems })
    return this
  }

  maxItems(maxItems: number): this {
    Object.assign(this.p, { maxItems })
    return this
  }

  uniqueItems(uniqueItems = true): this {
    Object.assign(this.p, { uniqueItems })
    return this
  }
}

export class JsonSchemaTupleBuilder<T = any> extends JsonSchemaAnyBuilder<T> {
  constructor(items: (JsonSchemaAnyBuilder<T> | JsonSchemaAny<T>)[]) {
    super()
    this.p = {
      type: 'array',
      items: items.map(i => (i instanceof JsonSchemaAnyBuilder ? i.build() : i)),
      minItems: items.length,
      maxItems: items.length,
    }
  }

  protected override p: JsonSchemaTuple
}

export class JsonSchemaEnumBuilder<
  T extends string | number = number,
> extends JsonSchemaAnyBuilder<T> {
  constructor(values: T[]) {
    super()
    this.p = {
      enum: values,
    }
  }

  protected override p: JsonSchemaEnum
}

export class JsonSchemaConstBuilder<
  T extends string | number | boolean = any,
> extends JsonSchemaAnyBuilder<T> {
  constructor(v: T) {
    super()
    this.p = {
      const: v,
    }
  }

  protected override p: JsonSchemaConst<T>
}

export class JsonSchemaRefBuilder<T = any> extends JsonSchemaAnyBuilder<T> {
  constructor($ref: string) {
    super()
    this.p = {
      $ref,
    }
  }

  protected override p: JsonSchemaRef
}

export class JsonSchemaNullBuilder extends JsonSchemaAnyBuilder<null> {
  protected override p: JsonSchemaNull = {
    type: 'null',
  }
}
