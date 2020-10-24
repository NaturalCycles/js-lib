import { getFullICUPathIfExists } from './test.util'

test('getFullICUPathIfExists', () => {
  expect(getFullICUPathIfExists()).toBeUndefined()
})

test('test run', () => {
  const fullICUPath = '/Users/aaa/node_modules/full-icu'

  const cmd = [fullICUPath && `NODE_ICU_DATA=${fullICUPath}`, 'jest'].filter(Boolean).join(' ')
  expect(cmd).toBe('NODE_ICU_DATA=/Users/aaa/node_modules/full-icu jest')
})
