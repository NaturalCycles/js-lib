import { inspect } from 'node:util'
import { _errorToErrorObject, _stringifyAny } from '../index'
import { HttpError } from './http.error'

const throwHttpError = () => {
  throw new HttpError('error', { httpStatusCode: 500 })
}
const throwHttpErrorAsync = async () => {
  throw new HttpError('error', { httpStatusCode: 500 })
}

test('default error to match snapshot', async () => {
  const err = new HttpError('error', { httpStatusCode: 500 })
  // console.log(err)
  expect(_errorToErrorObject(err)).toMatchSnapshot({
    stack: expect.stringContaining('HttpError'),
  })

  expect(throwHttpError).toThrow(HttpError)
  await expect(throwHttpErrorAsync()).rejects.toThrow(HttpError)
})

test('httpError printability', () => {
  const err = new HttpError('error', { httpStatusCode: 500 })
  // console.log(err)

  expect(err.name).toBe('HttpError')
  expect(err.constructor.name).toBe('HttpError')
  expect(err.constructor).toBe(HttpError)
  const s = filterStackTrace(inspect(err))
  // console.log(s)

  expect(s).not.toContain('constructor')
  expect(s).not.toContain('data')

  expect(err.data).toEqual({ httpStatusCode: 500 })
})

test('error message should be correct even if overridden when printing stack', () => {
  const err = new Error('some_error')
  err.message = 'changed_message'
  const s = _stringifyAny(err, { includeErrorStack: true })
  const lines = s.split('\n')
  expect(lines[0]).toBe('Error: changed_message')
  // console.log(s)
})

test('HttpError with cause', () => {
  const err1 = new Error('cozz')
  const err = new HttpError('hello', { httpStatusCode: 400 }, { cause: err1 })
  expect(err.cause).toBe(err1)
})

function filterStackTrace(s: string): string {
  return s
    .split('\n')
    .filter(line => !line.trimStart().startsWith('at '))
    .join('\n')
}
