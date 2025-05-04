import type { CommonLogger, JsonSchema, JsonSchemaBuilder } from '@naturalcycles/js-lib'
import {
  _filterNullishValues,
  _isObject,
  _substringBefore,
  JsonSchemaAnyBuilder,
} from '@naturalcycles/js-lib'
import type { Ajv, ValidateFunction } from 'ajv'
import { fs2 } from '../../fs/fs2.js'
import { _inspect } from '../../string/inspect.js'
import { AjvValidationError } from './ajvValidationError.js'
import { getAjv } from './getAjv.js'

export interface AjvValidationOptions {
  objectName?: string
  objectId?: string

  /**
   * @default to cfg.logErrors, which defaults to true
   */
  logErrors?: boolean

  /**
   * Used to separate multiple validation errors.
   *
   * @default cfg.separator || '\n'
   */
  separator?: string
}

export interface AjvSchemaCfg {
  /**
   * Pass Ajv instance, otherwise Ajv will be created with
   * AjvSchema default (not the same as Ajv defaults) parameters
   */
  ajv: Ajv

  /**
   * Dependent schemas to pass to Ajv instance constructor.
   * Simpler than instantiating and passing ajv instance yourself.
   */
  schemas?: (JsonSchema | JsonSchemaBuilder | AjvSchema)[]

  objectName?: string

  /**
   * Used to separate multiple validation errors.
   *
   * @default '\n'
   */
  separator: string

  /**
   * @default true
   */
  logErrors: boolean

  /**
   * Default to `console`
   */
  logger: CommonLogger

  /**
   * Option of Ajv.
   * If set to true - will mutate your input objects!
   * Defaults to false.
   *
   * This option is a "shortcut" to skip creating and passing Ajv instance.
   */
  coerceTypes?: boolean
}

/**
 * On creation - compiles ajv validation function.
 * Provides convenient methods, error reporting, etc.
 *
 * @experimental
 */
export class AjvSchema<T = unknown> {
  private constructor(
    public schema: JsonSchema<T>,
    cfg: Partial<AjvSchemaCfg> = {},
  ) {
    this.cfg = {
      logErrors: true,
      logger: console,
      separator: '\n',
      ...cfg,
      ajv:
        cfg.ajv ||
        getAjv({
          schemas: cfg.schemas?.map(s => {
            if (s instanceof AjvSchema) return s.schema
            if (s instanceof JsonSchemaAnyBuilder) return s.build()
            return s as JsonSchema
          }),
          coerceTypes: cfg.coerceTypes || false,
          // verbose: true,
        }),
      // Auto-detecting "ObjectName" from $id of the schema (e.g "Address.schema.json")
      objectName: cfg.objectName || (schema.$id ? _substringBefore(schema.$id, '.') : undefined),
    }

    this.validateFunction = this.cfg.ajv.compile<T>(schema)
  }

  /**
   * Conveniently allows to pass either JsonSchema or JsonSchemaBuilder, or existing AjvSchema.
   * If it's already an AjvSchema - it'll just return it without any processing.
   * If it's a Builder - will call `build` before proceeding.
   * Otherwise - will construct AjvSchema instance ready to be used.
   *
   * Implementation note: JsonSchemaBuilder goes first in the union type, otherwise TypeScript fails to infer <T> type
   * correctly for some reason.
   */
  static create<T>(
    schema: JsonSchemaBuilder<T> | JsonSchema<T> | AjvSchema<T>,
    cfg: Partial<AjvSchemaCfg> = {},
  ): AjvSchema<T> {
    if (schema instanceof AjvSchema) return schema
    if (schema instanceof JsonSchemaAnyBuilder) {
      return new AjvSchema<T>(schema.build(), cfg)
    }
    return new AjvSchema<T>(schema as JsonSchema<T>, cfg)
  }

  /**
   * Create AjvSchema directly from a filePath of json schema.
   * Convenient method that just does fs.readFileSync for you.
   */
  static readJsonSync<T = unknown>(
    filePath: string,
    cfg: Partial<AjvSchemaCfg> = {},
  ): AjvSchema<T> {
    fs2.requireFileToExist(filePath)
    const schema = fs2.readJson<JsonSchema<T>>(filePath)
    return new AjvSchema<T>(schema, cfg)
  }

  readonly cfg: AjvSchemaCfg
  private readonly validateFunction: ValidateFunction<T>

  /**
   * It returns the original object just for convenience.
   * Reminder: Ajv will MUTATE your object under 2 circumstances:
   * 1. `useDefaults` option (enabled by default!), which will set missing/empty values that have `default` set in the schema.
   * 2. `coerceTypes` (false by default).
   *
   * Returned object is always the same object (`===`) that was passed, so it is returned just for convenience.
   */
  validate(obj: T, opt: AjvValidationOptions = {}): T {
    const err = this.getValidationError(obj, opt)
    if (err) throw err
    return obj
  }

  getValidationError(obj: T, opt: AjvValidationOptions = {}): AjvValidationError | undefined {
    if (this.isValid(obj)) return

    const errors = this.validateFunction.errors!

    const {
      objectId = _isObject(obj) ? (obj['id' as keyof T] as any) : undefined,
      objectName = this.cfg.objectName,
      logErrors = this.cfg.logErrors,
      separator = this.cfg.separator,
    } = opt
    const name = [objectName || 'Object', objectId].filter(Boolean).join('.')

    let message = this.cfg.ajv.errorsText(errors, {
      dataVar: name,
      separator,
    })

    const strValue = _inspect(obj, { maxLen: 1000 })
    message = [message, 'Input: ' + strValue].join(separator)

    if (logErrors) {
      this.cfg.logger.error(errors)
    }

    return new AjvValidationError(
      message,
      _filterNullishValues({
        errors,
        userFriendly: true,
        objectName,
        objectId,
      }),
    )
  }

  isValid(obj: T): boolean {
    return this.validateFunction(obj)
  }
}
