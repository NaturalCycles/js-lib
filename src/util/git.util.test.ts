import {
  commitMessageToTitleMessage,
  getLastGitCommitMsg,
  gitCurrentBranchName,
  gitCurrentCommitTimestamp,
  gitCurrentRepoName,
  gitHasUncommittedChanges,
} from './git.util'

test('getLastGitCommitMsg', async () => {
  const msg = await getLastGitCommitMsg()
  console.log({ msg })
  expect(msg).toBeDefined()

  const title = commitMessageToTitleMessage(msg)
  console.log({ title })
  expect(title).toBeDefined()
})

test('gitHasUncommittedChanges', async () => {
  await gitHasUncommittedChanges()
})

test('gitCurrentBranchName', async () => {
  const branchName = await gitCurrentBranchName()
  console.log(branchName)
})

test('gitCurrentRepoName', async () => {
  await gitCurrentRepoName()
})

test('gitCurrentCommitTimestamp', async () => {
  const ts = await gitCurrentCommitTimestamp()
  console.log(ts, new Date(ts * 1000))
})
