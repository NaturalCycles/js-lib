import type { BaseDBEntity } from '../types.js'
import { jsonSchema } from './jsonSchemaBuilder.js'

export const baseDBEntityJsonSchema = jsonSchema.object<BaseDBEntity>({
  id: jsonSchema.string(),
  created: jsonSchema.unixTimestamp2000(),
  updated: jsonSchema.unixTimestamp2000(),
})
