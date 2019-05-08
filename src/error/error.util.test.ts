import { AppError, HttpError } from '..'
import {
  anyToAppError,
  anyToErrorMessage,
  anyToErrorObject,
  appErrorToErrorObject,
  errorObjectToAppError,
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
  new HttpError('http err msg', {
    httpStatusCode: 400,
  }),
]

test('anyToErrorMessage', () => {
  expect(anyItems.map(anyToErrorMessage)).toMatchSnapshot()
})

test('anyToErrorObject', () => {
  const out = anyItems
    .map(i => anyToErrorObject(i))
    .map(o => {
      delete o.stack // remove from snapshot matching
      return o
    })
  expect(out).toMatchSnapshot()
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
