import { BaseDBEntity, SavedDBEntity } from '../types'
import { jsonSchema } from './jsonSchemaBuilder'

export const baseDBEntityJsonSchema = jsonSchema.object<BaseDBEntity>({
  id: jsonSchema.string().optional(),
  created: jsonSchema.unixTimestamp().optional(),
  updated: jsonSchema.unixTimestamp().optional(),
})

export const savedDBEntityJsonSchema = jsonSchema.object<SavedDBEntity>({
  id: jsonSchema.string(),
  created: jsonSchema.unixTimestamp(),
  updated: jsonSchema.unixTimestamp(),
})
