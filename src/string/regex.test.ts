import { zEmail } from '../zod/zod.shared.schemas'
import { zIsValid } from '../zod/zod.util'
import { SIMPLE_EMAIL_REGEX } from './regex'

test.each(['a@b.cc', 'kirill@naturalcycles.com', 'kirill@naturalcycles.co.uk'])(
  'email valid %',
  s => {
    expect(s).toMatch(SIMPLE_EMAIL_REGEX)
    // cross-check with Zod
    expect(zIsValid(s, zEmail)).toBe(true)
  },
)

test.each([
  'kirill@@naturalcycles.com',
  'kirill@naturalcycles..com',
  'kirill@naturalcyclescom',
  'kirillnaturalcycles.com',
  '@kirillnaturalcycles.com',
  'kirill@naturalcycles.com@',
])('email invalid %', s => {
  expect(s).not.toMatch(SIMPLE_EMAIL_REGEX)
  // cross-check with Zod
  expect(zIsValid(s, zEmail)).toBe(false)
})
