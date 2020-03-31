import { expectResults } from '@naturalcycles/dev-lib/dist/testing'
import { AppError, HttpError, HttpErrorResponse } from '..'
import {
  anyToAppError,
  anyToErrorMessage,
  anyToErrorObject,
  appErrorToErrorObject,
  errorObjectToAppError,
  isErrorObject,
  isHttpErrorObject,
  isHttpErrorResponse,
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
  expectResults(anyToErrorMessage, anyItems).toMatchSnapshot()
})

test('anyToErrorMessage includeData=true', () => {
  expectResults(v => anyToErrorMessage(v, true), anyItems).toMatchSnapshot()
})

test('anyToErrorObject', () => {
  expectResults(v => {
    const r = anyToErrorObject(v)
    delete r.stack // remove from snapshot matching
    return r
  }, anyItems).toMatchSnapshot()
})

test('appErrorToErrorObject / errorObjectToAppError snapshot', () => {
  const data = { a: 'b' }
  const err1 = new AppError('hello', data)
  const err2 = appErrorToErrorObject(err1)
  // console.log(err2)

  expect(err2).toMatchSnapshot({
    stack: expect.stringContaining('AppError'),
  })

  const err3 = errorObjectToAppError(err2)
  expect(err3.message).toBe('hello')
  expect(err3.name).toBe('AppError')
  expect(err3.stack).not.toBeUndefined()
  expect(err3.data).toEqual(data)
})

test('anyToAppError snapshot', () => {
  const out = anyItems
    .map(i => anyToAppError(i))
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
  expectResults(v => isErrorObject(v), anyItems).toMatchSnapshot()
})

test('isHttpErrorObject', () => {
  expectResults(v => isHttpErrorObject(v), anyItems).toMatchSnapshot()
})

test('isHttpErrorResponse', () => {
  expectResults(v => isHttpErrorResponse(v), anyItems).toMatchSnapshot()
})
