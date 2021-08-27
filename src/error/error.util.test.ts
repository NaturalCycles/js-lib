import { expectResults } from '@naturalcycles/dev-lib/dist/testing'
import { AppError, ErrorObject, HttpError, HttpErrorResponse, _errorToErrorObject } from '..'
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
  expectResults(v => _anyToErrorObject(v), anyItems).toMatchSnapshot()
})

test('anyToError', () => {
  expectResults(v => _anyToError(v), anyItems).toMatchSnapshot()
})

test('appErrorToErrorObject / errorObjectToAppError snapshot', () => {
  const data = { a: 'b' }
  const err1 = new AppError('hello', data)
  const err2 = _errorToErrorObject(err1, true)
  // console.log(err2)

  expect(err2.name).toBe('AppError')
  expect(err2.message).toBe('hello')
  expect(err2).toMatchSnapshot({
    stack: expect.stringContaining('AppError'),
  })

  const err3 = _errorObjectToAppError(err2)
  expect(err3.message).toBe('hello')
  expect(err3.name).toBe('AppError')
  expect(err3.stack).not.toBeUndefined()
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
