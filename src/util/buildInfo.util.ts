import { localTime } from '@naturalcycles/js-lib'
import type { BuildInfo } from './buildInfo.model'
import {
  gitCurrentBranchName,
  gitCurrentCommitSha,
  gitCurrentCommitTimestamp,
  gitCurrentRepoName,
} from './git.util'

export function generateBuildInfo(dev = false): BuildInfo {
  const now = localTime()
  const ts = now.unix()
  const tsStr = now.toPretty()

  const rev = dev ? 'devRev' : gitCurrentCommitSha()
  const branchName = dev ? 'devBranch' : gitCurrentBranchName()
  const repoName = dev ? 'devRepo' : gitCurrentRepoName()
  const tsCommit = dev ? now.unix() : gitCurrentCommitTimestamp()

  const ver = [now.toStringCompact(), repoName, branchName, rev].join('_')

  return {
    ts,
    tsCommit,
    tsStr,
    repoName,
    branchName,
    rev,
    ver,
  }
}
