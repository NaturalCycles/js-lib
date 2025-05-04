import { expect, test } from 'vitest'
import { generateBuildInfo } from './buildInfo.util.js'

test('generateBuildInfo', () => {
  let buildInfo = generateBuildInfo()
  // console.log(buildInfo)
  expect(buildInfo).toMatchObject({
    repoName: 'js-libs',
    env: 'test',
  })

  process.env['APP_ENV'] = ''
  buildInfo = generateBuildInfo()
  console.log(buildInfo)
  expect(buildInfo.env).not.toBe('test') // read from package.json
})
