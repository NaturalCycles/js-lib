export interface BuildInfo {
  ts: number

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
}
