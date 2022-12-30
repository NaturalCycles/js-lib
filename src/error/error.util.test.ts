import { expectResults } from '@naturalcycles/dev-lib/dist/testing'
import type { ErrorObject, HttpErrorResponse } from '..'
import {
  AppError,
  HttpError,
  _errorToErrorObject,
  _omit,
  _errorObjectToError,
  AssertionError,
  _errorDataAppend,
} from '..'
import {
  _anyToError,
  _anyToErrorObject,
  _errorObjectToAppError,
  _isErrorObject,
  _isHttpErrorObject,
  _isHttpErrorResponse,
} from './error.util'

const anyItems = [
  undefined,
  null,
  '',
  'hello a',
  0,
  1,
  -5,
  () => 'smth',
  {},
  [],
  ['a'],
  { a: 'aa' },
  new Error('err msg'),
  // plain objects, not a qualified ErrorObject
  { message: 'yada' },
  { message: 'yada', data: {} },
  { message: 'yada', data: { httpStatusCode: 404 } },
  // qualified ErrorObjects:
  { name: 'Error', message: 'yada' } as ErrorObject,
  { name: 'Error', message: 'yada', data: {} } as ErrorObject,
  { name: 'Error', message: 'yada', data: { httpStatusCode: 404 } } as ErrorObject,
  // Other
  new AppError('err msg'),
  new HttpError('http err msg', {
    httpStatusCode: 400,
  }),
  {
    error: {
      name: 'HttpError',
      message: 'err msg',
      data: {
        httpStatusCode: 400,
        a: 'b\nc',
      },
    },
  } as HttpErrorResponse,
]

test('anyToErrorObject', () => {
  // omitting stack only for snapshot determinism
  expectResults(v => _omit(_anyToErrorObject(v), ['stack']), anyItems).toMatchSnapshot()
})

test('anyToError', () => {
  expectResults(v => _anyToError(v), anyItems).toMatchSnapshot()

  const httpError = new HttpError('la la', {
    httpStatusCode: 400,
    userFriendly: true,
  })

  // Because httpError is instance of Error - it should return exactly same object
  const httpError2 = _anyToError(httpError)
  expect(httpError2).toBe(httpError)

  const httpErrorObject = _anyToErrorObject(httpError)
  expect(httpErrorObject).not.toBeInstanceOf(Error)
  expect(_omit(httpErrorObject, ['stack'])).toMatchInlineSnapshot(`
    {
      "data": {
        "httpStatusCode": 400,
        "userFriendly": true,
      },
      "message": "la la",
      "name": "HttpError",
    }
  `)

  // This is an "httpError", but packed in Error
  // With e.g name == 'HttpError'
  const httpError3 = _anyToError(httpErrorObject)
  expect(httpError3).toMatchInlineSnapshot(`[HttpError: la la]`)
  expect(httpError3).toBeInstanceOf(Error)
  expect(httpError3).not.toBeInstanceOf(HttpError)
  expect(httpError3.name).toBe(httpError.name)
  expect((httpError3 as HttpError).data).toEqual(httpError.data)
  expect(httpError3.stack).toBe(httpError.stack) // should preserve the original stack, despite "re-packing"

  // This is a "proper" HttpError
  const httpError4 = _anyToError(httpErrorObject, HttpError)
  expect(httpError4).toMatchInlineSnapshot(`[HttpError: la la]`)
  expect(httpError4).toBeInstanceOf(HttpError)
  expect(httpError4.name).toBe(httpError.name)
  expect(httpError4.data).toEqual(httpError.data)
  expect(httpError4.stack).toBe(httpError.stack) // should preserve the original stack, despite "re-packing"
})

test('appErrorToErrorObject / errorObjectToAppError snapshot', () => {
  const data = { a: 'b' }
  const err1 = new AppError('hello', data)
  const err2 = _errorToErrorObject(err1)
  // console.log(err2)

  expect(err2.name).toBe('AppError')
  expect(err2.message).toBe('hello')
  expect(err2).toMatchSnapshot({
    stack: expect.stringContaining('AppError'),
  })

  const err3 = _errorObjectToAppError(err2)
  expect(err3.message).toBe('hello')
  expect(err3.name).toBe('AppError')
  expect(err3.stack).toBeDefined()
  expect(err3.data).toEqual(data)
})

test('isErrorObject', () => {
  expectResults(v => _isErrorObject(v), anyItems).toMatchSnapshot()
})

test('isHttpErrorObject', () => {
  expectResults(v => _isHttpErrorObject(v), anyItems).toMatchSnapshot()
})

test('isHttpErrorResponse', () => {
  expectResults(v => _isHttpErrorResponse(v), anyItems).toMatchSnapshot()
})

test('_errorObjectToError should not repack if already same error', () => {
  const e = new HttpError('yo', { httpStatusCode: 400 })
  expect(_isErrorObject(e)).toBe(true)
  const e2 = _errorObjectToError(e, HttpError)
  expect(e2).toBe(e)
  const e3 = _anyToError(e)
  expect(e3).toBe(e)

  // errorClass is Error - still should NOT re-pack
  expect(_errorObjectToError(e)).toBe(e)
  expect(_anyToError(e)).toBe(e)

  // But if errorClass is different - it SHOULD re-pack
  const e4 = _errorObjectToError(e, AssertionError)
  expect(e4).not.toBe(e)
  expect(e4).toBeInstanceOf(AssertionError)
  expect(e4.name).toBe(e.name) // non-trivial, but name is kept as HttpError
  expect(e4.data).toBe(e.data)
  expect(e4.stack).toBe(e.stack) // important to preserve the stack!
})

test('_errorDataAppend', () => {
  const err = new Error('yo') as any
  _errorDataAppend(err, { httpStatusCode: 401 })
  expect(err).toMatchInlineSnapshot(`[Error: yo]`)
  expect(err.data).toMatchInlineSnapshot(`
    {
      "httpStatusCode": 401,
    }
  `)

  const err2 = new AppError('yo', {
    code: 'A',
  })
  _errorDataAppend(err2, { httpStatusCode: 401 })
  expect((err2 as any).data).toMatchInlineSnapshot(`
    {
      "code": "A",
      "httpStatusCode": 401,
    }
  `)

  _errorDataAppend(err2, { code: 'B' })
  expect((err2 as any).data).toMatchInlineSnapshot(`
    {
      "code": "B",
      "httpStatusCode": 401,
    }
  `)
})
