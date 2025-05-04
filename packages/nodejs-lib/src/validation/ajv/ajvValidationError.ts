import type { ErrorData } from '@naturalcycles/js-lib'
import { AppError } from '@naturalcycles/js-lib'
import type { ErrorObject } from 'ajv'

export interface AjvValidationErrorData extends ErrorData {
  errors: ErrorObject[]
  objectName?: string
  objectId?: string
}

export class AjvValidationError extends AppError<AjvValidationErrorData> {
  constructor(message: string, data: AjvValidationErrorData) {
    super(message, data, {
      name: 'AjvValidationError',
    })
  }
}
