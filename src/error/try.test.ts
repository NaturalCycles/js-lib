import { AppError } from './app.error'
import { _try, pTry } from './try'

const okFunction = (v = 1) => ({ result: v })
const errFunction = () => {
  throw new AppError('oj')
}

test('_try', () => {
  const [err, res] = _try(() => okFunction())
  expect(err).toBeNull()
  expect(res).toEqual({ result: 1 })

  // On this line we're testing that `res` type is non-optional (by design)
  expect(res.result).toBe(1)

  expect(_try(okFunction)).toEqual([null, { result: 1 }])
  expect(_try(() => okFunction(3))).toEqual([null, { result: 3 }])

  const [err2, v] = _try<AppError>(errFunction)
  expect(err2).toMatchInlineSnapshot(`[AppError: oj]`)
  expect(v).toBeUndefined()
})

const createOkPromise = async (v = 1) => ({ result: v })
const createErrorPromise = async () => {
  throw new AppError('oj')
}

test('pTry', async () => {
  const [err, res] = await pTry(createOkPromise())
  expect(err).toBeNull()
  expect(res).toEqual({ result: 1 })

  // On this line we're testing that `res` type is non-optional (by design)
  expect(res.result).toBe(1)

  const [err2, res2] = await pTry<AppError>(createErrorPromise())
  expect(err2).toMatchInlineSnapshot(`[AppError: oj]`)
  expect(res2).toBeUndefined()
  // console.log(err2!.stack)
  // Test that "async-stacktraces" are preserved and it shows the originating function name
  expect(err2?.stack?.includes('at createErrorPromise')).toBe(true)
})
