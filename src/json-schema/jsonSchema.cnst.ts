import {
  JsonSchema,
  JsonSchemaAny,
  JsonSchemaNumber,
  JsonSchemaObject,
  JsonSchemaString,
} from './jsonSchema.model'

export const JSON_SCHEMA_ORDER: (
  | keyof JsonSchema
  | keyof JsonSchemaAny
  | keyof JsonSchemaObject
  | keyof JsonSchemaString
  | keyof JsonSchemaNumber
)[] = [
  '$schema',
  '$id',
  'title',
  'description',
  'deprecated',
  'readOnly',
  'writeOnly',
  'type',
  'default',
  // Object,
  'properties',
  'required',
  'minProperties',
  'maxProperties',
  'patternProperties',
  'propertyNames',
  // Array
  'properties',
  'required',
  'minProperties',
  'maxProperties',
  'patternProperties',
  'propertyNames',
  // String
  'pattern',
  'minLength',
  'maxLength',
  'format',
  'transform',
  // Number
  'format',
  'multipleOf',
  'minimum',
  'exclusiveMinimum',
  'maximum',
  'exclusiveMaximum',
]
