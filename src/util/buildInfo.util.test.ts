import { generateBuildInfo } from './buildInfo.util'

test('generateBuildInfo', () => {
  const buildInfo = generateBuildInfo()
  console.log(buildInfo)
})
