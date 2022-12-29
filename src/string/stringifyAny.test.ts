import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { inspectAnyStringifyFn } from '@naturalcycles/nodejs-lib'
import { HttpErrorResponse } from '../error/error.model'
import { _errorToErrorObject } from '../error/error.util'
import { HttpError } from '../error/http.error'
import { _stringifyAny, setGlobalStringifyFunction } from './stringifyAny'

test('stringifyAny default', () => {
  expectResults(v => _stringifyAny(v), mockAllKindsOfThings()).toMatchSnapshot()
})

test('stringifyAny includeErrorData', () => {
  expectResults(
    v => _stringifyAny(v, { includeErrorData: true }),
    mockAllKindsOfThings(),
  ).toMatchSnapshot()
})

test('httpError', () => {
  const err = new HttpError('la la', {
    httpStatusCode: 409,
    userFriendly: true,
    other: 'otherValue',
  })

  expect(_stringifyAny(err)).toMatchInlineSnapshot(`"HttpError(409): la la"`)

  expect(_stringifyAny(err, { includeErrorData: true })).toMatchInlineSnapshot(`
    "HttpError(409): la la
    {
      "httpStatusCode": 409,
      "userFriendly": true,
      "other": "otherValue"
    }"
  `)
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

  expect(_stringifyAny(resp, { includeErrorData: true })).toMatchInlineSnapshot(`
    "HttpError(409): la la
    second line
    {
      "httpStatusCode": 409,
      "userFriendly": true,
      "other": "otherValue"
    }"
  `)

  // this tests "duplicated line" bug
  // expect(_stringifyAny(resp, { includeErrorStack: true })).toMatchInlineSnapshot()
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
