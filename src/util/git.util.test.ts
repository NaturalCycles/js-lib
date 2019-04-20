import {
  commitMessageToTitleMessage,
  getLastGitCommitMsg,
  gitCurrentBranchName,
  gitCurrentRepoName,
  gitHasUncommittedChanges,
} from './git.util'

test('getLastGitCommitMsg', async () => {
  const msg = await getLastGitCommitMsg()
  console.log({ msg })
  expect(msg).not.toBeUndefined()

  const title = commitMessageToTitleMessage(msg)
  console.log({ title })
  expect(title).not.toBeUndefined()
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
