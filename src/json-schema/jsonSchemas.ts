import type { BaseDBEntity } from '../types'
import { jsonSchema } from './jsonSchemaBuilder'

export const baseDBEntityJsonSchema = jsonSchema.object<BaseDBEntity>({
  id: jsonSchema.string(),
  created: jsonSchema.unixTimestamp2000(),
  updated: jsonSchema.unixTimestamp2000(),
})
