import { _appErrorToErrorObject } from './error.util'
import { HttpError } from './http.error'

const throwHttpError = () => {
  throw new HttpError('error', { httpStatusCode: 500 })
}
const throwHttpErrorAsync = async () => {
  throw new HttpError('error', { httpStatusCode: 500 })
}

test('default error to match snapshot', async () => {
  const err = new HttpError('error', { httpStatusCode: 500 })
  // console.log(err)
  expect(_appErrorToErrorObject(err)).toMatchSnapshot({
    stack: expect.stringContaining('HttpError'),
  })

  expect(throwHttpError).toThrow(HttpError)
  await expect(throwHttpErrorAsync()).rejects.toThrow(HttpError)
})
