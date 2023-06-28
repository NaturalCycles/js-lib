import { localTime } from '@naturalcycles/js-lib'
import type { BuildInfo } from './buildInfo.model'
import {
  gitCurrentBranchName,
  gitCurrentCommitSha,
  gitCurrentCommitTimestamp,
  gitCurrentRepoName,
} from './git.util'

export function generateBuildInfo(): BuildInfo {
  const { APP_ENV } = process.env
  const now = localTime()
  const ts = now.unix()
  const tsStr = now.toPretty()

  const rev = gitCurrentCommitSha()
  const branchName = gitCurrentBranchName()
  const repoName = gitCurrentRepoName()
  const tsCommit = gitCurrentCommitTimestamp()

  const ver = [now.toStringCompact(), repoName, branchName, rev].join('_')

  return {
    ts,
    tsCommit,
    tsStr,
    repoName,
    branchName,
    rev,
    ver,
    env: APP_ENV,
  }
}

export function generateBuildInfoDev(): BuildInfo {
  const now = localTime()
  const ts = now.unix()
  const tsStr = now.toPretty()

  const rev = 'devRev'
  const branchName = 'devBranch'
  const repoName = 'devRepo'
  const tsCommit = now.unix()

  const ver = [now.toStringCompact(), repoName, branchName, rev].join('_')

  return {
    ts,
    tsCommit,
    tsStr,
    repoName,
    branchName,
    rev,
    ver,
    env: 'dev',
  }
}
