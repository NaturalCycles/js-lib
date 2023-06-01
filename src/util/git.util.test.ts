import {
  commitMessageToTitleMessage,
  getLastGitCommitMsg,
  gitCurrentBranchName,
  gitCurrentCommitTimestamp,
  gitCurrentRepoName,
  gitHasUncommittedChanges,
} from './git.util'

test('getLastGitCommitMsg', async () => {
  const msg = getLastGitCommitMsg()
  console.log({ msg })
  expect(msg).toBeDefined()

  const title = commitMessageToTitleMessage(msg)
  console.log({ title })
  expect(title).toBeDefined()
})

test('gitHasUncommittedChanges', async () => {
  const changes = gitHasUncommittedChanges()
  console.log({ changes })
})

test('gitCurrentBranchName', async () => {
  const branchName = gitCurrentBranchName()
  console.log(branchName)
})

test('gitCurrentRepoName', async () => {
  gitCurrentRepoName()
})

test('gitCurrentCommitTimestamp', async () => {
  const ts = gitCurrentCommitTimestamp()
  console.log(ts, new Date(ts * 1000))
})
