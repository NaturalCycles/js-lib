import { inspect } from 'node:util'
import { AppError } from './app.error'

const throwAppError = () => {
  throw new AppError('error')
}
const throwAppErrorAsync = async () => {
  throw new AppError('error')
}

test('appError properties should be present', async () => {
  // Error.captureStackTrace = false as any
  const r = new AppError('hello')
  // console.log(r.message, r.name, r.stack)
  expect(r.message).toBe('hello')
  expect(r.name).toBe('AppError')
  expect(r.stack).toBeDefined()

  const data = { a: 'b' }
  const r2 = new AppError('hello', data)
  expect(r2.data).toEqual(data)

  expect(throwAppError).toThrow(AppError)
  await expect(throwAppErrorAsync()).rejects.toThrow(AppError)
})

test('appError should work when Error.captureStacktrace is n/a', () => {
  Error.captureStackTrace = false as any
  const r = new AppError('hello')
  // console.log(r.message, r.name, r.stack)
  expect(r.message).toBe('hello')
  expect(r.name).toBe('AppError')
  expect(r.stack).toBeDefined()
})

test('AppError log should NOT include constructor and data', () => {
  const err = new AppError('hello')
  // console.log(err)

  expect(err.name).toBe('AppError')
  expect(err.constructor.name).toBe('AppError')
  expect(err.constructor).toBe(AppError)
  const s = filterStackTrace(inspect(err))
  // console.log(s)

  expect(s).not.toContain('constructor')
  expect(s).not.toContain('data')

  // Should allow writing to this property
  err.data = {}
})

test('AppError with cause', () => {
  const err1 = new Error('cozz')
  const err = new AppError('hello', {}, { cause: err1 })
  expect(err.cause).toBe(err1)
})

function filterStackTrace(s: string): string {
  return s
    .split('\n')
    .filter(line => !line.trimStart().startsWith('at '))
    .join('\n')
}
