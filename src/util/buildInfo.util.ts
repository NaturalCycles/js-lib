import { BuildInfo } from './buildInfo.model'
import { gitCurrentBranchName, gitCurrentCommitSha, gitCurrentRepoName } from './git.util'

export async function generateBuildInfo (dev = false): Promise<BuildInfo> {
  const [rev, branchName, repoName] = dev
    ? ['devRev', 'devBranch', 'devRepo']
    : await Promise.all([gitCurrentCommitSha(), gitCurrentBranchName(), gitCurrentRepoName()])

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
    tsStr,
    repoName,
    branchName,
    rev,
    ver,
  }
}

/**
 * Turns Object with keys/values into a *.sh script that exports all keys as values.
 *
 * @example
 * { a: 'b', b: 'c'}
 *
 * will turn into:
 *
 * export a="b"
 * export b="c"
 */
export function objectToShellExport (o: any, prefix = ''): string {
  return Object.keys(o)
    .map(k => {
      const v = o[k]
      if (v) {
        return `export ${prefix}${k}="${v}"`
      }
    })
    .filter(Boolean)
    .join('\n')
}
