import * as cp from 'node:child_process'
import * as path from 'node:path'
import { grey } from '@naturalcycles/nodejs-lib/dist/colors'
import type { UnixTimestampNumber } from '@naturalcycles/js-lib'

export function getLastGitCommitMsg(): string {
  return execSync('git log -1 --pretty=%B')
}

export function commitMessageToTitleMessage(msg: string): string {
  const firstLine = msg.split('\n')[0]!
  const [preTitle, title] = firstLine.split(': ')
  return title || preTitle!
}

export function gitHasUncommittedChanges(): boolean {
  // git diff-index --quiet HEAD -- || echo "untracked"
  try {
    cp.execSync('git diff-index --quiet HEAD --', {
      encoding: 'utf8',
    })
    return false
  } catch {
    return true
  }
}

/**
 * @returns true if there were changes
 */
export function gitCommitAll(msg: string): boolean {
  // git commit -a -m "style(lint-all): $GIT_MSG" || true
  const cmd = `git commit -a --no-verify -m "${msg}"`
  // const cmd = `git`
  // const args = ['commit', '-a', '--no-verify', '-m', msg]

  console.log(grey(cmd))

  try {
    cp.execSync(cmd, {
      stdio: 'inherit',
    })
    return true
  } catch {
    return false
  }
}

/**
 * @returns true if there are not pushed commits.
 */
export function gitIsAhead(): boolean {
  // ahead=`git rev-list HEAD --not --remotes | wc -l | awk '{print $1}'`
  const cmd = `git rev-list HEAD --not --remotes | wc -l | awk '{print $1}'`

  const stdout = execSync(cmd)

  // console.log(`gitIsAhead: ${stdout}`)
  return Number(stdout) > 0
}

export function gitPull(): void {
  const cmd = 'git pull'
  try {
    cp.execSync(cmd, {
      stdio: 'inherit',
    })
  } catch {}
}

export function gitPush(): void {
  // git push --set-upstream origin $CIRCLE_BRANCH && echo "pushed, exiting" && exit 0
  let cmd = 'git push'

  const branchName = gitCurrentBranchName()

  if (branchName) {
    cmd += ` --set-upstream origin ${branchName}`
  }

  console.log(grey(cmd))

  cp.execSync(cmd, {
    stdio: 'inherit',
  })
}

export function gitCurrentCommitSha(full = false): string {
  const sha = execSync('git rev-parse HEAD')
  return full ? sha : sha.slice(0, 7)
}

export function gitCurrentCommitTimestamp(): UnixTimestampNumber {
  return Number(execSync('git log -1 --format=%ct'))
}

export function gitCurrentBranchName(): string {
  return execSync('git rev-parse --abbrev-ref HEAD')
}

export function gitCurrentRepoName(): string {
  const originUrl = execSync('git config --get remote.origin.url')
  return path.basename(originUrl, '.git')
}

function execSync(cmd: string): string {
  return cp
    .execSync(cmd, {
      encoding: 'utf8',
      // stdio: 'inherit', // no, otherwise we don't get the output returned
    })
    .trim()
}
