import { localTime } from '../datetime/localTime'
import type { UnixTimestampNumber } from '../types'

export interface BuildInfo {
  /**
   * Unix timestamp of when the build was made.
   */
  ts: UnixTimestampNumber

  /**
   * Unix timestamp of commit ("committer date", not "author date")
   */
  tsCommit: UnixTimestampNumber

  repoName: string
  branchName: string

  /**
   * GIT sha revision (first 7 characters)
   */
  rev: string

  /**
   * "Version string" in the following format:
   * yyyyMMdd_HHmm_$repoName_$branch_$rev
   *
   * E.g:
   * 20190419_1728_myrepo_master_21aecf5
   */
  ver: string

  /**
   * Build during development.
   */
  dev?: boolean

  /**
   * Build "environment".
   * Normally taken from process.env.APP_ENV
   * Can be undefined.
   */
  env?: string
}

export function generateBuildInfoDev(): BuildInfo {
  const now = localTime.now()
  const ts = now.unix()
  const rev = 'devRev'
  const branchName = 'devBranch'
  const repoName = 'devRepo'
  const tsCommit = now.unix()

  const ver = [now.toStringCompact(), repoName, branchName, rev].join('_')

  return {
    ts,
    tsCommit,
    repoName,
    branchName,
    rev,
    ver,
    env: 'dev',
  }
}
