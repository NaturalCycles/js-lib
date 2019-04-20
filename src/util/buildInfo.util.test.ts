import { generateBuildInfo } from './buildInfo.util'

test('generateBuildInfo', async () => {
  const buildInfo = await generateBuildInfo()
  console.log(buildInfo)
})
