import { expectTypeOf } from 'expect-type'
import { AppError } from './app.error'
import { HttpRequestError } from './httpRequestError'
import { _expectedError, _try, pExpectedError, pTry, UnexpectedPassError } from './try'

const okFunction = (v = 1) => ({ result: v })
const errFunction = () => {
  throw new AppError('oj')
}

test('_try', () => {
  const [err, res] = _try(() => okFunction())
  expectTypeOf(err).toEqualTypeOf<Error | null>()
  expectTypeOf(res).toEqualTypeOf<{ result: number }>()
  expect(err).toBeNull()
  expect(res).toEqual({ result: 1 })

  // On this line we're testing that `res` type is non-optional (by design)
  expect(res.result).toBe(1)

  expect(_try(okFunction)).toEqual([null, { result: 1 }])
  expect(_try(() => okFunction(3))).toEqual([null, { result: 3 }])

  const [err2, v] = _try(errFunction)
  expect(err2).toMatchInlineSnapshot(`[AppError: oj]`)
  expect(v).toBeUndefined()
})

const createOkPromise = async (v = 1) => ({ result: v })
const createErrorPromise = async () => {
  throw new AppError('oj')
}

test('pTry', async () => {
  const [err, res] = await pTry(createOkPromise())
  expectTypeOf(err).toEqualTypeOf<Error | null>()
  expectTypeOf(res).toEqualTypeOf<{ result: number }>()

  expect(err).toBeNull()
  expect(res).toEqual({ result: 1 })

  // On this line we're testing that `res` type is non-optional (by design)
  expect(res.result).toBe(1)

  const [err2, res2] = await pTry(createErrorPromise())
  expect(err2).toMatchInlineSnapshot(`[AppError: oj]`)
  expect(res2).toBeUndefined()
  // console.log(err2!.stack)
  // Test that "async-stacktraces" are preserved and it shows the originating function name
  expect(err2?.stack?.includes('at createErrorPromise')).toBe(true)
})

test('_expectedError', () => {
  const err = _expectedError(errFunction, AppError)
  expectTypeOf(err).toEqualTypeOf<AppError<any>>()
  expect(err).toMatchInlineSnapshot(`[AppError: oj]`)
  expect(err).toBeInstanceOf(AppError)

  const [err2] = _try(() => _expectedError(() => okFunction()))
  expect(err2).toBeInstanceOf(UnexpectedPassError)
  expect(err2!.message).toMatchInlineSnapshot(`"expected error was not thrown"`)
})

test('pExpectedError', async () => {
  const err = await pExpectedError<AppError>(createErrorPromise())
  expect(err).toMatchInlineSnapshot(`[AppError: oj]`)
  expect(err).toBeInstanceOf(AppError)

  const err1 = await pExpectedError(createErrorPromise(), AppError)
  expectTypeOf(err1).toEqualTypeOf<AppError<any>>()

  const [err2] = await pTry(pExpectedError(createOkPromise()))
  expect(err2).toBeInstanceOf(UnexpectedPassError)
  expect(err2!.message).toMatchInlineSnapshot(`"expected error was not thrown"`)

  const [err3] = await pTry(pExpectedError(createErrorPromise(), HttpRequestError))
  expect(err3!.message).toMatchInlineSnapshot(`"oj"`)
})
