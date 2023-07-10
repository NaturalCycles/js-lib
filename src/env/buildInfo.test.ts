import { mockTime } from '@naturalcycles/dev-lib/dist/testing'
import { generateBuildInfoDev } from './buildInfo'

beforeEach(() => {
  mockTime()
})

test('buildInfo', () => {
  expect(generateBuildInfoDev()).toMatchInlineSnapshot(`
    {
      "branchName": "devBranch",
      "env": "dev",
      "repoName": "devRepo",
      "rev": "devRev",
      "ts": 1529539200,
      "tsCommit": 1529539200,
      "ver": "20180621_0000_devRepo_devBranch_devRev",
    }
  `)
})
