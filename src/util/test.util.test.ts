import { getFullICUPathIfExists } from './test.util'

test('getFullICUPathIfExists', () => {
  expect(getFullICUPathIfExists()).toBeUndefined()
})
