import { BaseDBEntity, SavedDBEntity } from '../types'
import { jsonSchema } from './jsonSchemaBuilder'

export const baseDBEntityJsonSchema = jsonSchema.object<BaseDBEntity>({
  id: jsonSchema.string().optional(),
  created: jsonSchema.unixTimestamp2000().optional(),
  updated: jsonSchema.unixTimestamp2000().optional(),
})

export const savedDBEntityJsonSchema = jsonSchema.object<SavedDBEntity>({
  id: jsonSchema.string(),
  created: jsonSchema.unixTimestamp2000(),
  updated: jsonSchema.unixTimestamp2000(),
})
