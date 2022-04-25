import { expectResults, mockAllKindsOfThings } from '@naturalcycles/dev-lib/dist/testing'
import { HttpErrorResponse } from '../error/error.model'
import { HttpError } from '../error/http.error'
import { _errorToErrorObject, _stringifyAny } from '../index'
import { _jsonParseIfPossible } from './json.util'

test('jsonParseIfPossible', () => {
  expectResults(v => _jsonParseIfPossible(v), mockAllKindsOfThings()).toMatchSnapshot()

  expect(_jsonParseIfPossible('{"a": "b"}')).toEqual({ a: 'b' })
  expect(_jsonParseIfPossible('  {"a": "b"}')).toEqual({ a: 'b' })
  expect(_jsonParseIfPossible('5')).toBe(5)
  expect(_jsonParseIfPossible('something')).toBe('something')
  expect(_jsonParseIfPossible('{something')).toBe('{something')
})

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
  const err = new HttpError('la la', {
    httpStatusCode: 409,
    userFriendly: true,
    other: 'otherValue',
  })

  const resp: HttpErrorResponse = {
    error: _errorToErrorObject(err),
  }
  expect(resp.error.name).toBe('HttpError')

  expect(_stringifyAny(resp)).toMatchInlineSnapshot(`"HttpError(409): la la"`)

  expect(_stringifyAny(resp, { includeErrorData: true })).toMatchInlineSnapshot(`
    "HttpError(409): la la
    {
      "httpStatusCode": 409,
      "userFriendly": true,
      "other": "otherValue"
    }"
  `)
})
