import { BuildInfo } from './buildInfo.model'
import {
  gitCurrentBranchName,
  gitCurrentCommitSha,
  gitCurrentCommitTimestamp,
  gitCurrentRepoName,
} from './git.util'

export async function generateBuildInfo (dev = false): Promise<BuildInfo> {
  const [rev, branchName, repoName, tsCommit] = dev
    ? ['devRev', 'devBranch', 'devRepo', Math.floor(Date.now() / 1000)]
    : await Promise.all([
        gitCurrentCommitSha(),
        gitCurrentBranchName(),
        gitCurrentRepoName(),
        gitCurrentCommitTimestamp(),
      ])

  const now = new Date()
  const ts = Math.floor(now.getTime() / 1000)
  const year = String(now.getUTCFullYear())
  const month = String(now.getUTCMonth() + 1).padStart(2, '0')
  const day = String(now.getUTCDate()).padStart(2, '0')
  const hour = String(now.getUTCHours()).padStart(2, '0')
  const minute = String(now.getUTCMinutes()).padStart(2, '0')
  const second = String(now.getUTCSeconds()).padStart(2, '0')

  const tsStr = [[year, month, day].join('-'), [hour, minute, second].join(':')].join(' ')

  const ver = [
    [year, month, day].join(''),
    [hour, minute].join(''),
    repoName,
    branchName,
    rev,
  ].join('_')

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
