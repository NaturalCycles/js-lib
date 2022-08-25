import { localTime } from '@naturalcycles/js-lib'
import type { BuildInfo } from './buildInfo.model'
import {
  gitCurrentBranchName,
  gitCurrentCommitSha,
  gitCurrentCommitTimestamp,
  gitCurrentRepoName,
} from './git.util'

export async function generateBuildInfo(dev = false): Promise<BuildInfo> {
  const now = localTime()

  const [rev, branchName, repoName, tsCommit] = dev
    ? ['devRev', 'devBranch', 'devRepo', now.unix()]
    : await Promise.all([
        gitCurrentCommitSha(),
        gitCurrentBranchName(),
        gitCurrentRepoName(),
        gitCurrentCommitTimestamp(),
      ])

  const ts = now.unix()

  const tsStr = now.toPretty()

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
