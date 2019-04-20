import * as execa from 'execa'
import { logExec } from './exec.util'

export async function getLastGitCommitMsg (): Promise<string> {
  // git log -1 --pretty=%B
  const cmd = 'git'
  const args = ['log', '-1', '--pretty=%B']

  const { stdout: msg } = await execa(cmd, args)

  return msg
}

export function commitMessageToTitleMessage (msg: string): string {
  const firstLine = msg.split('\n')[0]
  const [preTitle, title] = firstLine.split(': ')
  return title || preTitle
}

export async function gitHasUncommittedChanges (): Promise<boolean> {
  // git diff-index --quiet HEAD -- || echo "untracked"
  const cmd = 'git diff-index --quiet HEAD --'
  const { code } = await execa(cmd, {
    shell: true,
    reject: false,
  })
  // console.log(code)
  return !!code
}

/**
 * @returns true if there were changes
 */
export async function gitCommitAll (msg: string): Promise<boolean> {
  // git commit -a -m "style(lint-all): $GIT_MSG" || true
  // const cmd = `git commit -a --no-verify -m "${msg}"`
  const cmd = `git`
  const args = ['commit', '-a', '--no-verify', '-m', msg]

  logExec(cmd, args)
  const { code } = await execa(cmd, args, {
    // shell: true,
    stdio: 'inherit',
    reject: false,
  })
  console.log(`gitCommitAll code: ${code}`)

  return !code
}

/**
 * @returns true if there are not pushed commits.
 */
export async function gitIsAhead (): Promise<boolean> {
  // ahead=`git rev-list HEAD --not --remotes | wc -l | awk '{print $1}'`
  const cmd = `git rev-list HEAD --not --remotes | wc -l | awk '{print $1}'`
  const { stdout } = await execa(cmd, { shell: true })
  console.log(`gitIsAhead: ${stdout}`)
  return Number(stdout) > 0
}

export async function gitPush (): Promise<void> {
  // git push --set-upstream origin $CIRCLE_BRANCH && echo "pushed, exiting" && exit 0
  const cmd = 'git'
  const args = ['push']

  const { CIRCLE_BRANCH } = process.env
  const branchName = CIRCLE_BRANCH || (await gitCurrentBranchName())

  if (branchName) {
    args.push('--set-upstream', 'origin', branchName)
  }

  logExec(cmd, args)
  await execa(cmd, args, {
    stdio: 'inherit',
  })
}

export async function gitCurrentBranchName (): Promise<string> {
  // git rev-parse --abbrev-ref HEAD
  const cmd = 'git'
  const args = ['rev-parse', '--abbrev-ref', 'HEAD']

  const { stdout: branchName } = await execa(cmd, args)
  // console.log(`gitCurrentBranchName: ${branchName}`)
  return branchName
}
