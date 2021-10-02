import { pTuple } from './pTuple'

const failingPromise = new Promise((resolve, reject) => {
  reject(new Error('FAILED'))
})

const resolvingPromise = new Promise<boolean>(resolve => {
  resolve(true)
})

test('pTuple should catch async errors', async () => {
  const [error] = await pTuple(failingPromise)
  expect(!!error).toBe(true)
  expect(error instanceof Error).toBe(true)
})

test('pTuple should not have result when catching error', async () => {
  const [error, result] = await pTuple(failingPromise)

  expect(error instanceof Error).toBe(true)
  expect(!!result).toBe(false)
})

test('pTuple should pass the result to the second element of the tuple', async () => {
  const [error, result] = await pTuple(resolvingPromise)
  expect(error).toBe(null)
  expect(result).toBe(true)
})
