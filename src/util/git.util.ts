import * as cp from 'node:child_process'
import * as path from 'node:path'
import type { UnixTimestampNumber } from '@naturalcycles/js-lib'
import { logExec } from '@naturalcycles/nodejs-lib/dist/exec/exec.util'
import execa = require('execa')

export function getLastGitCommitMsg(): string {
  return execSync('git log -1 --pretty=%B')
}

export function commitMessageToTitleMessage(msg: string): string {
  const firstLine = msg.split('\n')[0]!
  const [preTitle, title] = firstLine.split(': ')
  return title || preTitle!
}

export async function gitHasUncommittedChanges(): Promise<boolean> {
  // git diff-index --quiet HEAD -- || echo "untracked"
  const cmd = 'git diff-index --quiet HEAD --'
  const { exitCode } = await execa(cmd, {
    shell: true,
    reject: false,
  })
  // console.log(code)
  return !!exitCode
}

/**
 * @returns true if there were changes
 */
export async function gitCommitAll(msg: string): Promise<boolean> {
  // git commit -a -m "style(lint-all): $GIT_MSG" || true
  // const cmd = `git commit -a --no-verify -m "${msg}"`
  const cmd = `git`
  const args = ['commit', '-a', '--no-verify', '-m', msg]

  logExec(cmd, args)
  const { exitCode } = await execa(cmd, args, {
    // shell: true,
    stdio: 'inherit',
    reject: false,
  })
  // console.log(`gitCommitAll code: ${code}`)

  return !exitCode
}

/**
 * @returns true if there are not pushed commits.
 */
export async function gitIsAhead(): Promise<boolean> {
  // ahead=`git rev-list HEAD --not --remotes | wc -l | awk '{print $1}'`
  const cmd = `git rev-list HEAD --not --remotes | wc -l | awk '{print $1}'`
  const { stdout } = await execa(cmd, { shell: true })
  // console.log(`gitIsAhead: ${stdout}`)
  return Number(stdout) > 0
}

export async function gitPull(): Promise<void> {
  const cmd = 'git'
  const args = ['pull']
  await execa(cmd, args, {
    reject: false,
    stdio: 'inherit',
  })
}

export async function gitPush(): Promise<void> {
  // git push --set-upstream origin $CIRCLE_BRANCH && echo "pushed, exiting" && exit 0
  const cmd = 'git'
  const args = ['push']

  const { CIRCLE_BRANCH } = process.env
  const branchName = CIRCLE_BRANCH || gitCurrentBranchName()

  if (branchName) {
    args.push('--set-upstream', 'origin', branchName)
  }

  logExec(cmd, args)
  await execa(cmd, args, {
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
  return cp.execSync(cmd).toString().trim()
}
