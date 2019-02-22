import { AppError } from '..'
import { errorSharedUtil } from './error.shared.util'

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
]

test('anyToErrorMessage', () => {
  expect(anyItems.map(errorSharedUtil.anyToErrorMessage)).toMatchSnapshot()
})

test('anyToErrorObject', () => {
  expect(anyItems.map(i => errorSharedUtil.anyToErrorObject(i))).toMatchSnapshot()
})

test('appErrorToErrorObject / errorObjectToAppError snapshot', () => {
  const data = { a: 'b' }
  const err1 = new AppError('hello', data)
  const err2 = errorSharedUtil.appErrorToErrorObject(err1)
  // console.log(err2)

  expect(err2).toMatchSnapshot({
    stack: expect.stringContaining('AppError'),
  })

  const err3 = errorSharedUtil.errorObjectToAppError(err2)
  expect(err3.message).toBe('hello')
  expect(err3.name).toBe('AppError')
  expect(err3.stack).not.toBeUndefined()
  expect(err3.data).toEqual(data)
})
