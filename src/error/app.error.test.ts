import { AppError } from './app.error'

test('appError properties should be present', () => {
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

test('appError when Error.captureStacktrace is n/a', () => {
  Error.captureStackTrace = false as any
  const r = new AppError('hello')
  // console.log(r.message, r.name, r.stack)
  expect(r.message).toBe('hello')
  expect(r.name).toBe('AppError')
  expect(r.stack).not.toBeUndefined()
})
