import { ZodError, type ZodIssue, type ZodSchema } from 'zod'
import { _stringify } from '../string/stringify'

export interface ZodErrorResult<T> {
  success: false
  data?: T
  error: ZodValidationError<T>
}

export interface ZodSuccessResult<T> {
  success: true
  data: T
  error?: ZodValidationError<T>
}

export function zIsValid<T>(value: T, schema: ZodSchema<T>): boolean {
  const { success } = schema.safeParse(value)
  return success
}

export function zValidate<T>(value: T, schema: ZodSchema<T>): T {
  const r = zSafeValidate(value, schema)
  if (r.success) {
    return r.data
  }

  throw r.error
}

export function zSafeValidate<T>(
  value: T,
  schema: ZodSchema<T>,
  // objectName?: string,
): ZodSuccessResult<T> | ZodErrorResult<T> {
  const r = schema.safeParse(value)
  if (r.success) {
    return r
  }

  return {
    success: false,
    error: new ZodValidationError<T>(r.error.issues, value, schema),
  }
}

export class ZodValidationError<T> extends ZodError<T> {
  constructor(
    issues: ZodIssue[],
    public value: T,
    public schema: ZodSchema<T>,
  ) {
    super(issues)
  }

  override get message(): string {
    return this.annotate()
  }

  annotate(): string {
    let objectTitle = this.schema.description

    if (typeof this.value === 'object' && this.value) {
      const objectName = this.schema.description || this.value.constructor?.name
      const objectId = (this.value as any)['id'] as string
      objectTitle = [objectName, objectId].filter(Boolean).join('.')
    }

    objectTitle ||= 'data'

    return [
      `Invalid ${objectTitle}`,
      '',
      'Input:',
      _stringify(this.value),
      this.issues.length > 1 ? `\n${this.issues.length} issues:` : '',
      ...this.issues.slice(0, 100).map(i => {
        return [i.path.join('.'), i.message].filter(Boolean).join(': ')
      }),
    ].join('\n')
  }
}
