import { AppError } from './app.error'
import { _try } from './try'

const okFunction = (v = 1) => v
const errFunction = () => {
  throw new AppError('oj')
}

test('_try', () => {
  expect(_try(okFunction)).toEqual([undefined, 1])
  expect(_try(() => okFunction(3))).toEqual([undefined, 3])

  const [err, v] = _try<AppError>(errFunction)
  expect(err).toMatchInlineSnapshot(`[AppError: oj]`)
  expect(v).toBeUndefined()
})
