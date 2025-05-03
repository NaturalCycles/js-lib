import { expect, test } from 'vitest'
import { git2 } from './git2.js'

test('getLastGitCommitMsg', async () => {
  const msg = git2.getLastGitCommitMsg()
  console.log({ msg })
  expect(msg).toBeDefined()

  const title = git2.commitMessageToTitleMessage(msg)
  console.log({ title })
  expect(title).toBeDefined()
})

test('gitHasUncommittedChanges', async () => {
  const changes = git2.hasUncommittedChanges()
  console.log({ changes })
})

test('gitCurrentBranchName', async () => {
  const branchName = git2.getCurrentBranchName()
  console.log(branchName)
})

test('gitCurrentRepoName', async () => {
  git2.getCurrentRepoName()
})

test('gitCurrentCommitTimestamp', async () => {
  const ts = git2.getCurrentCommitTimestamp()
  console.log(ts, new Date(ts * 1000))
})
