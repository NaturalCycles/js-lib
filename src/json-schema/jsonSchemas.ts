import { BaseDBEntity, SavedDBEntity } from '../types'
import { jsonSchema } from './jsonSchemaBuilder'

export const baseDBEntityJsonSchema = jsonSchema.object<BaseDBEntity>({}).baseDBEntity().build()

export const savedDBEntityJsonSchema = jsonSchema.object<SavedDBEntity>({}).savedDBEntity().build()
