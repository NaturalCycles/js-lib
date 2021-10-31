import { inspect } from 'util'
import { _errorToErrorObject } from '../index'
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
  expect(_errorToErrorObject(err, true)).toMatchSnapshot({
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

function filterStackTrace(s: string): string {
  return s
    .split('\n')
    .filter(line => !line.trimStart().startsWith('at '))
    .join('\n')
}
