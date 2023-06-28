import { UnixTimestampNumber } from '@naturalcycles/js-lib'

export interface BuildInfo {
  /**
   * Unix timestamp of when the build was made.
   */
  ts: UnixTimestampNumber

  /**
   * Unix timestamp of commit ("committer date", not "author date")
   */
  tsCommit: UnixTimestampNumber

  /**
   * Human-readable time of the build. E.g:
   * 2019-06-21 18:35:19
   */
  tsStr: string

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
