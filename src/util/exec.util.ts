import * as c from 'ansi-colors'
import { SpawnOptions } from 'child_process'
import * as execa from 'execa'

interface ExecOptions extends SpawnOptions {}

export async function proxyCommand (
  cmd: string,
  args: string[] = [],
  opt: ExecOptions = {},
): Promise<void> {
  const [, , ...processArgs] = process.argv

  await execCommand(cmd, [...args, ...processArgs], {
    // shell: true,
    ...opt,
  })
}

export async function execCommand (
  cmd: string,
  args: string[] = [],
  opt: ExecOptions = {},
): Promise<void> {
  logExec(cmd, args, opt)

  await execa(cmd, args, {
    stdio: 'inherit',
    env: opt.env,
  }).catch(err => {
    process.exit(err.code || 1)
    throw err // just for tests
  })
}

export function logExec (cmd: string, args: string[] = [], opt: ExecOptions = {}): void {
  const cmdline = [
    ...Object.entries(opt.env || {}).map(([k, v]) => [k, v].join('=')),
    cmd,
    ...args,
  ].join(' ')

  console.log(c.grey(cmdline))
}
