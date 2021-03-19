import { pTo } from './pTo'

const FailingPromise = new Promise((resolve, reject) => {
  reject(new Error('FAILED'))
})

const ResolvingPromise = new Promise<boolean>(resolve => {
  resolve(true)
})

test('TO should catch async errors', async () => {
  const [error] = await pTo(FailingPromise)

  expect(!!error).toBe(true)
  expect(error instanceof Error).toBe(true)
})

test('TO should not have result when catching error', async () => {
  const [error, result] = await pTo(FailingPromise)

  expect(error instanceof Error).toBe(true)
  expect(!!result).toBe(false)
})

test('TO should pass the result to the second element of the tuple', async () => {
  const [error, result] = await pTo(ResolvingPromise)

  expect(error).toBe(null)
  expect(result).toBe(true)
})
