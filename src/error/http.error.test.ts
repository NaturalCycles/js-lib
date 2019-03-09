import { appErrorToErrorObject } from './error.util'
import { HttpError } from './http.error'

const throwHttpError = () => {
  throw new HttpError()
}
const throwHttpErrorAsync = async () => {
  throw new HttpError()
}

test('default error to match snapshot', async () => {
  const err = new HttpError()
  // console.log(err)
  expect(appErrorToErrorObject(err)).toMatchSnapshot({
    stack: expect.stringContaining('HttpError'),
  })

  expect(throwHttpError).toThrow(HttpError)
  await expect(throwHttpErrorAsync()).rejects.toThrow(HttpError)
})
