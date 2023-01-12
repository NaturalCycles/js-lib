import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { inspectAnyStringifyFn } from '@naturalcycles/nodejs-lib'
import { HttpErrorResponse } from '../error/error.model'
import { _errorToErrorObject } from '../error/error.util'
import { HttpError } from '../error/http.error'
import { pExpectedError } from '../error/try'
import { _stringifyAny, setGlobalStringifyFunction } from './stringifyAny'

test('stringifyAny default', () => {
  expectResults(v => _stringifyAny(v), mockAllKindsOfThings()).toMatchSnapshot()
})

test('stringifyAny includeErrorData', () => {
  expectResults(v => _stringifyAny(v), mockAllKindsOfThings()).toMatchSnapshot()
})

test('httpError', () => {
  const err = new HttpError('la la', {
    httpStatusCode: 409,
    userFriendly: true,
    other: 'otherValue',
  })

  expect(_stringifyAny(err)).toMatchInlineSnapshot(`"HttpError(409): la la"`)
})

test('httpErrorResponse', () => {
  const err = new HttpError('la la\nsecond line', {
    httpStatusCode: 409,
    userFriendly: true,
    other: 'otherValue',
  })

  const resp: HttpErrorResponse = {
    error: _errorToErrorObject(err),
  }
  expect(resp.error.name).toBe('HttpError')

  expect(_stringifyAny(resp)).toMatchInlineSnapshot(`
    "HttpError(409): la la
    second line"
  `)

  // this tests "duplicated line" bug
  // expect(_stringifyAny(resp, { includeErrorStack: true })).toMatchInlineSnapshot()
})

test('error with cause', () => {
  const err = new Error('err1', {
    cause: new HttpError(
      'http_error1',
      { httpStatusCode: 400 },
      {
        cause: new Error('sub-cause'),
      },
    ),
  })

  expect(_stringifyAny(err)).toMatchInlineSnapshot(`
    "Error: err1
    caused by: HttpError(400): http_error1
    caused by: Error: sub-cause"
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
