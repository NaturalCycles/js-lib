import type { JsonSchema, JsonSchemaBuilder } from '@naturalcycles/js-lib'
import { _get, AppError } from '@naturalcycles/js-lib'
import type { AjvValidationError } from '@naturalcycles/nodejs-lib'
import { AjvSchema } from '@naturalcycles/nodejs-lib'
import type { BackendRequestHandler } from '../server.model.js'
import type { ReqValidationOptions } from './validateRequest.js'

const REDACTED = 'REDACTED'

export function validateBody(
  schema: JsonSchema | JsonSchemaBuilder | AjvSchema,
  opt: ReqValidationOptions<AjvValidationError> = {},
): BackendRequestHandler {
  return validateObject('body', schema, opt)
}

export function validateParams(
  schema: JsonSchema | JsonSchemaBuilder | AjvSchema,
  opt: ReqValidationOptions<AjvValidationError> = {},
): BackendRequestHandler {
  return validateObject('params', schema, opt)
}

export function validateQuery(
  schema: JsonSchema | JsonSchemaBuilder | AjvSchema,
  opt: ReqValidationOptions<AjvValidationError> = {},
): BackendRequestHandler {
  return validateObject('query', schema, opt)
}

export function validateHeaders(
  schema: JsonSchema | JsonSchemaBuilder | AjvSchema,
  opt: ReqValidationOptions<AjvValidationError> = {},
): BackendRequestHandler {
  return validateObject('headers', schema, opt)
}

/**
 * Validates req property (body, params or query).
 * Supports Joi schema or AjvSchema (from nodejs-lib).
 * Able to redact sensitive data from the error message.
 * Throws http 400 on error.
 */
function validateObject(
  prop: 'body' | 'params' | 'query' | 'headers',
  schema: JsonSchema | JsonSchemaBuilder | AjvSchema,
  opt: ReqValidationOptions<AjvValidationError> = {},
): BackendRequestHandler {
  const ajvSchema = AjvSchema.create(schema, {
    objectName: `request ${prop}`,
  })

  const reportPredicate =
    typeof opt.report === 'function' ? opt.report : () => opt.report as boolean | undefined

  return (req, _res, next) => {
    const error = ajvSchema.getValidationError(req[prop] || {})
    if (error) {
      const report = reportPredicate(error)

      if (opt.redactPaths) {
        redact(opt.redactPaths, req[prop], error)
        error.data.errors.length = 0 // clears the array
      }

      return next(
        new AppError(error.message, {
          backendResponseStatusCode: 400,
          report,
          ...error.data,
        }),
      )
    }

    next()
  }
}

/**
 * Mutates error
 */
function redact(redactPaths: string[], obj: any, error: Error): void {
  redactPaths
    .map(path => _get(obj, path) as string)
    .filter(Boolean)
    .forEach(secret => {
      error.message = error.message.replaceAll(secret, REDACTED)
    })
}
