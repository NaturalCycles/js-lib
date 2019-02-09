import { errorSharedUtil } from '../util/error.shared.util'
import { HttpError } from './http.error'

test('default error to match snapshot', () => {
  const err = new HttpError()
  // console.log(err)
  expect(errorSharedUtil.appErrorToErrorObject(err)).toMatchSnapshot({
    stack: expect.stringContaining('HttpError'),
  })
})
