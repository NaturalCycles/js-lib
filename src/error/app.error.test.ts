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
  expect(r.stack).not.toBeUndefined()

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
  expect(r.stack).not.toBeUndefined()
})
