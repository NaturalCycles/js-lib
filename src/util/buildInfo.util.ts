import { _filterUndefinedValues, BuildInfo, localTime } from '@naturalcycles/js-lib'
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

  return _filterUndefinedValues({
    ts,
    tsCommit,
    tsStr,
    repoName,
    branchName,
    rev,
    ver,
    env: APP_ENV,
  })
}
