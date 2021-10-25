import { _uniq } from '../array/array.util'
import {
  BaseDBEntity,
  JsonSchemaAllOf,
  JsonSchemaArray,
  JsonSchemaOneOf,
  JsonSchemaTuple,
  mergeJsonSchemaObjects,
  SavedDBEntity,
  _deepCopy,
  _sortObject,
  AnyObject,
} from '../index'
import { JSON_SCHEMA_ORDER } from './jsonSchema.cnst'
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

export interface JsonSchemaBuilder<T = unknown> {
  build(): JsonSchema<T>
}

/**
 * Fluent (chainable) API to manually create Json Schemas.
 * Inspired by Joi
 */
export const jsonSchema = {
  any<T = unknown>() {
    return new JsonSchemaAnyBuilder<T, JsonSchemaAny<T>>({})
  },
  const<T = unknown>(value: T) {
    return new JsonSchemaAnyBuilder<T, JsonSchemaConst<T>>({
      const: value,
    })
  },
  null() {
    return new JsonSchemaAnyBuilder<null, JsonSchemaNull>({
      type: 'null',
    })
  },
  ref<T = unknown>($ref: string) {
    return new JsonSchemaAnyBuilder<T, JsonSchemaRef<T>>({
      $ref,
    })
  },
  enum<T = unknown>(enumValues: T[]) {
    return new JsonSchemaAnyBuilder<T, JsonSchemaEnum<T>>({ enum: enumValues })
  },
  boolean() {
    return new JsonSchemaAnyBuilder<boolean, JsonSchemaBoolean>({
      type: 'boolean',
    })
  },
  buffer() {
    return new JsonSchemaAnyBuilder<Buffer, JsonSchemaAny<Buffer>>({
      instanceof: 'Buffer',
    })
  },

  // number types
  number() {
    return new JsonSchemaNumberBuilder()
  },
  integer() {
    return new JsonSchemaNumberBuilder().integer()
  },
  unixTimestamp() {
    return new JsonSchemaNumberBuilder().unixTimestamp()
  },
  // string types
  string() {
    return new JsonSchemaStringBuilder()
  },
  dateString() {
    return new JsonSchemaStringBuilder().date()
  },
  // email: () => new JsonSchemaStringBuilder().email(),
  // complex types
  object<T extends AnyObject>(props: {
    [k in keyof T]: JsonSchemaAnyBuilder<T[k]>
  }) {
    return new JsonSchemaObjectBuilder<T>().addProperties(props)
  },
  rootObject<T extends AnyObject>(props: {
    [k in keyof T]: JsonSchemaAnyBuilder<T[k]>
  }) {
    return new JsonSchemaObjectBuilder<T>().addProperties(props).$schemaDraft7()
  },
  array<ITEM = unknown>(itemSchema: JsonSchemaAnyBuilder<ITEM>) {
    return new JsonSchemaArrayBuilder<ITEM>(itemSchema)
  },
  tuple<T extends any[] = unknown[]>(items: JsonSchemaAnyBuilder[]) {
    return new JsonSchemaTupleBuilder<T>(items)
  },
  oneOf<T = unknown>(items: JsonSchemaAnyBuilder[]) {
    return new JsonSchemaAnyBuilder<T, JsonSchemaOneOf<T>>({
      oneOf: items.map(b => b.build()),
    })
  },
  allOf<T = unknown>(items: JsonSchemaAnyBuilder[]) {
    return new JsonSchemaAnyBuilder<T, JsonSchemaAllOf<T>>({
      allOf: items.map(b => b.build()),
    })
  },
}

export class JsonSchemaAnyBuilder<T = unknown, SCHEMA_TYPE extends JsonSchema<T> = JsonSchema<T>>
  implements JsonSchemaBuilder<T>
{
  constructor(protected schema: SCHEMA_TYPE) {}

  /**
   * Used in ObjectBuilder to access schema.optionalProperty
   */
  getSchema(): SCHEMA_TYPE {
    return this.schema
  }

  $schema($schema: string): this {
    Object.assign(this.schema, { $schema })
    return this
  }
  $schemaDraft7(): this {
    this.$schema('http://json-schema.org/draft-07/schema#')
    return this
  }
  $id($id: string): this {
    Object.assign(this.schema, { $id })
    return this
  }
  title(title: string): this {
    Object.assign(this.schema, { title })
    return this
  }
  description(description: string): this {
    Object.assign(this.schema, { description })
    return this
  }
  deprecated(deprecated = true): this {
    Object.assign(this.schema, { deprecated })
    return this
  }
  type(type: string): this {
    Object.assign(this.schema, { type })
    return this
  }
  default(v: any): this {
    Object.assign(this.schema, { default: v })
    return this
  }
  oneOf(schemas: JsonSchema[]): this {
    Object.assign(this.schema, { oneOf: schemas })
    return this
  }
  allOf(schemas: JsonSchema[]): this {
    Object.assign(this.schema, { allOf: schemas })
    return this
  }

  instanceof(of: string): this {
    this.schema.instanceof = of
    return this
  }

  optional(optional = true): this {
    if (optional) {
      this.schema.optionalField = true
    } else {
      delete this.schema.optionalField
    }
    return this
  }

  /**
   * Produces a "clean schema object" without methods.
   * Same as if it would be JSON.stringified.
   */
  build(): SCHEMA_TYPE {
    return _sortObject(JSON.parse(JSON.stringify(this.schema)), JSON_SCHEMA_ORDER)
  }

  clone(): JsonSchemaAnyBuilder<T, SCHEMA_TYPE> {
    return new JsonSchemaAnyBuilder<T, SCHEMA_TYPE>(_deepCopy(this.schema))
  }
}

export class JsonSchemaNumberBuilder extends JsonSchemaAnyBuilder<number, JsonSchemaNumber> {
  constructor() {
    super({
      type: 'number',
    })
  }

  integer(): this {
    Object.assign(this.schema, { type: 'integer' })
    return this
  }

  multipleOf(multipleOf: number): this {
    Object.assign(this.schema, { multipleOf })
    return this
  }
  min(minimum: number): this {
    Object.assign(this.schema, { minimum })
    return this
  }
  exclusiveMin(exclusiveMinimum: number): this {
    Object.assign(this.schema, { exclusiveMinimum })
    return this
  }
  max(maximum: number): this {
    Object.assign(this.schema, { maximum })
    return this
  }
  exclusiveMax(exclusiveMaximum: number): this {
    Object.assign(this.schema, { exclusiveMaximum })
    return this
  }

  /**
   * Both ranges are inclusive.
   */
  range(minimum: number, maximum: number): this {
    Object.assign(this.schema, { minimum, maximum })
    return this
  }

  format(format: string): this {
    Object.assign(this.schema, { format })
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
}

export class JsonSchemaStringBuilder extends JsonSchemaAnyBuilder<string, JsonSchemaString> {
  constructor() {
    super({
      type: 'string',
    })
  }

  pattern(pattern: string): this {
    Object.assign(this.schema, { pattern })
    return this
  }
  min(minLength: number): this {
    Object.assign(this.schema, { minLength })
    return this
  }
  max(maxLength: number): this {
    Object.assign(this.schema, { maxLength })
    return this
  }
  length(minLength: number, maxLength: number): this {
    Object.assign(this.schema, { minLength, maxLength })
    return this
  }

  format(format: string): this {
    Object.assign(this.schema, { format })
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
      this.schema.transform = _uniq([...(this.schema.transform || []), t])
    } else {
      this.schema.transform = this.schema.transform?.filter(s => s !== t)
    }
    return this
  }

  // contentMediaType?: string
  // contentEncoding?: string
}

export class JsonSchemaObjectBuilder<T extends AnyObject> extends JsonSchemaAnyBuilder<
  T,
  JsonSchemaObject<T>
> {
  constructor() {
    super({
      type: 'object',
      properties: {} as T,
      required: [],
      additionalProperties: false,
    })
  }

  addProperties(props: { [k in keyof T]: JsonSchemaBuilder<T[k]> }): this {
    Object.entries(props).forEach(([k, builder]: [keyof T, JsonSchemaBuilder]) => {
      const schema = builder.build()
      if (!schema.optionalField) {
        this.schema.required.push(k)
      } else {
        delete schema.optionalField
      }
      this.schema.properties[k] = schema
    })

    this.required(this.schema.required) // ensure it's sorted and _uniq

    return this
  }

  /**
   * Ensures `required` is always sorted and _uniq
   */
  required(required: (keyof T)[]): this {
    Object.assign(this.schema, { required })
    this.schema.required = _uniq(required).sort()
    return this
  }

  addRequired(required: (keyof T)[]): this {
    return this.required([...this.schema.required, ...required])
  }

  minProps(minProperties: number): this {
    Object.assign(this.schema, { minProperties })
    return this
  }
  maxProps(maxProperties: number): this {
    Object.assign(this.schema, { maxProperties })
    return this
  }
  additionalProps(additionalProperties: boolean): this {
    Object.assign(this.schema, { additionalProperties })
    return this
  }

  baseDBEntity(): JsonSchemaObjectBuilder<T & BaseDBEntity> {
    Object.assign(this.schema.properties, {
      id: { type: 'string' },
      created: { type: 'number', format: 'unixTimestamp' },
      updated: { type: 'number', format: 'unixTimestamp' },
    })

    return this
  }

  savedDBEntity(): JsonSchemaObjectBuilder<T & SavedDBEntity> {
    return this.baseDBEntity().addRequired(['id', 'created', 'updated']) as any
  }

  extend<T2 extends AnyObject>(s2: JsonSchemaObjectBuilder<T2>): JsonSchemaObjectBuilder<T & T2> {
    const builder = new JsonSchemaObjectBuilder<T & T2>()
    Object.assign(builder.schema, _deepCopy(this.schema))
    mergeJsonSchemaObjects(builder.schema, s2.schema)
    return builder
  }
}

export class JsonSchemaArrayBuilder<ITEM> extends JsonSchemaAnyBuilder<
  ITEM[],
  JsonSchemaArray<ITEM>
> {
  constructor(itemsSchema: JsonSchemaBuilder<ITEM>) {
    super({
      type: 'array',
      items: itemsSchema.build(),
    })
  }

  min(minItems: number): this {
    Object.assign(this.schema, { minItems })
    return this
  }
  max(maxItems: number): this {
    Object.assign(this.schema, { maxItems })
    return this
  }
  unique(uniqueItems: number): this {
    Object.assign(this.schema, { uniqueItems })
    return this
  }
}

export class JsonSchemaTupleBuilder<T extends any[]> extends JsonSchemaAnyBuilder<
  T,
  JsonSchemaTuple<T>
> {
  constructor(items: JsonSchemaBuilder[]) {
    super({
      type: 'array',
      items: items.map(b => b.build()),
      minItems: items.length,
      maxItems: items.length,
    })
  }
}
