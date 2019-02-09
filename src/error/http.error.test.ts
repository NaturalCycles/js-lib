import { HttpError } from './http.error'

test('default error to match snapshot', () => {
  const err = new HttpError()
  expect(err.toErrorObject()).toMatchSnapshot({
    stack: expect.stringContaining('HttpError'),
  })
})
