import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { inspectAnyStringifyFn } from '@naturalcycles/nodejs-lib'
import { AppError } from '../error/app.error'
import { BackendErrorResponseObject } from '../error/error.model'
import { _errorLikeToErrorObject } from '../error/error.util'
import { pExpectedError } from '../error/try'
import { _stringifyAny, setGlobalStringifyFunction } from './stringifyAny'

test('stringifyAny default', () => {
  expectResults(v => _stringifyAny(v), mockAllKindsOfThings()).toMatchSnapshot()

  expectResults(
    v =>
      _stringifyAny(v, {
        includeErrorData: true,
      }),
    mockAllKindsOfThings(),
  ).toMatchSnapshot()
})

test('appError', () => {
  const err = new AppError('la la', {
    httpStatusCode: 409,
    userFriendly: true,
    other: 'otherValue',
  })

  expect(_stringifyAny(err)).toMatchInlineSnapshot(`"AppError: la la"`)

  expect(_stringifyAny(err, { includeErrorData: true })).toMatchInlineSnapshot(`
    "AppError: la la
    {
      "httpStatusCode": 409,
      "userFriendly": true,
      "other": "otherValue"
    }"
  `)
})

test('appError with status 0', () => {
  const err = new AppError('la la', {
    httpStatusCode: 0,
    userFriendly: true,
    other: 'otherValue',
  })

  expect(_stringifyAny(err)).toMatchInlineSnapshot(`"AppError: la la"`)
})

test('backendErrorResponse', () => {
  const err = new AppError('la la\nsecond line', {
    httpStatusCode: 409,
    userFriendly: true,
    other: 'otherValue',
  })

  const resp: BackendErrorResponseObject = {
    error: _errorLikeToErrorObject(err),
  }
  expect(resp.error.name).toBe('AppError')

  expect(_stringifyAny(resp)).toMatchInlineSnapshot(`
    "AppError: la la
    second line"
  `)

  // this tests "duplicated line" bug
  // expect(_stringifyAny(resp, { includeErrorStack: true })).toMatchInlineSnapshot()
})

test('error with cause', () => {
  const err = new Error('err1', {
    cause: new AppError(
      'http_error1',
      {
        httpStatusCode: 400,
      },
      {
        cause: {
          name: 'SomeError',
          message: 'sub-cause',
          data: {},
        },
      },
    ),
  })

  expect(_stringifyAny(err)).toMatchInlineSnapshot(`
    "Error: err1
    Caused by: AppError: http_error1
    Caused by: SomeError: sub-cause"
  `)
})

test('AggregateError', async () => {
  const err = await pExpectedError(
    Promise.any([
      new Promise((_, reject) => reject(new Error('err1'))),
      new Promise((_, reject) => reject(new Error('err2'))),
    ]),
    AggregateError,
  )

  expect(_stringifyAny(err)).toMatchInlineSnapshot(`
    "AggregateError: All promises were rejected
    2 error(s):
    1. Error: err1
    2. Error: err2"
  `)
})

const obj = {
  a: 'a',
  b: { c: 'c' },
}

test('simple object', () => {
  expect(_stringifyAny(obj)).toMatchInlineSnapshot(`
    "{
      "a": "a",
      "b": {
        "c": "c"
      }
    }"
  `)
})

test('setGlobalStringifyFunction', () => {
  setGlobalStringifyFunction(inspectAnyStringifyFn)

  expect(_stringifyAny(obj)).toMatchInlineSnapshot(`"{ a: 'a', b: { c: 'c' } }"`)
})
