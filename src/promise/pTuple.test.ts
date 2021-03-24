import { pTuple } from './pTuple'

const FailingPromise = new Promise((resolve, reject) => {
  reject(new Error('FAILED'))
})

const ResolvingPromise = new Promise<boolean>(resolve => {
  resolve(true)
})

test('pTuple should catch async errors', async () => {
  const [error] = await pTuple(FailingPromise)
  expect(!!error).toBe(true)
  expect(error instanceof Error).toBe(true)
})

test('pTuple should not have result when catching error', async () => {
  const [error, result] = await pTuple(FailingPromise)

  expect(error instanceof Error).toBe(true)
  expect(!!result).toBe(false)
})

test('pTuple should pass the result to the second element of the tuple', async () => {
  const [error, result] = await pTuple(ResolvingPromise)
  expect(error).toBe(null)
  expect(result).toBe(true)
})
