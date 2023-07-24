import { formDataToObject, objectToFormData } from './form.util'
import { AnyObject } from './types'

test('objectToFormData', () => {
  let o: AnyObject = {}
  let fd = objectToFormData(o)
  expect(fd).toBeInstanceOf(FormData)
  let o2 = formDataToObject(fd)
  expect(o2).toEqual({})

  o = {
    a: 'a',
    b: 2,
  }
  fd = objectToFormData(o)
  o2 = formDataToObject(fd)
  // expect(o2).toEqual(o)
  expect(o2).toEqual({
    ...o,
    b: '2', // everything is a string now
  })
})
