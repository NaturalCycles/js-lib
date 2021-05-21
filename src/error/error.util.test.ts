import { expectResults } from '@naturalcycles/dev-lib/dist/testing'
import { AppError, HttpError, HttpErrorResponse } from '..'
import {
  _anyToAppError,
  _anyToErrorMessage,
  _anyToErrorObject,
  _appErrorToErrorObject,
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
  { message: 'yada' },
  { message: 'yada', data: {} },
  { message: 'yada', data: { httpStatusCode: 404 } },
  new AppError('err msg'),
  new HttpError('http err msg', {
    httpStatusCode: 400,
  }),
  {
    error: {
      message: 'err msg',
      data: {
        httpStatusCode: 400,
        a: 'b\nc',
      },
    },
  } as HttpErrorResponse,
]

test('anyToErrorMessage', () => {
  expectResults(_anyToErrorMessage, anyItems).toMatchSnapshot()
})

test('anyToErrorMessage includeData=true', () => {
  expectResults(v => _anyToErrorMessage(v, true), anyItems).toMatchSnapshot()
})

test('anyToErrorObject', () => {
  expectResults(v => {
    const r = _anyToErrorObject(v)
    delete r.stack // remove from snapshot matching
    return r
  }, anyItems).toMatchSnapshot()
})

test('appErrorToErrorObject / errorObjectToAppError snapshot', () => {
  const data = { a: 'b' }
  const err1 = new AppError('hello', data)
  const err2 = _appErrorToErrorObject(err1)
  // console.log(err2)

  expect(err2).toMatchSnapshot({
    stack: expect.stringContaining('AppError'),
  })

  const err3 = _errorObjectToAppError(err2)
  expect(err3.message).toBe('hello')
  expect(err3.name).toBe('AppError')
  expect(err3.stack).not.toBeUndefined()
  expect(err3.data).toEqual(data)
})

test('anyToAppError snapshot', () => {
  const out = anyItems
    .map(i => _anyToAppError(i))
    .map(o => {
      delete o.stack // remove from snapshot matching
      return o
    })
  expect(out).toMatchSnapshot()

  out.forEach(e => {
    expect(e).toBeInstanceOf(AppError)
    expect(e.data).toMatchObject({})
  })
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
