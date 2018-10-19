import { AppError } from './app.error'

test('appError', () => {
  // Error.captureStackTrace = false as any
  const r = new AppError('hello')
  // console.log(r.message, r.name, r.stack)
  expect(r.message).toBe('hello')
  expect(r.name).toBe('AppError')
  expect(r.stack).not.toBeUndefined()

  const data = { a: 'b' }
  const r2 = new AppError('hello', data)
  expect(r2.data).toEqual(data)
})

test('appError no captureStacktrace', () => {
  Error.captureStackTrace = false as any
  const r = new AppError('hello')
  // console.log(r.message, r.name, r.stack)
  expect(r.message).toBe('hello')
  expect(r.name).toBe('AppError')
  expect(r.stack).not.toBeUndefined()
})
