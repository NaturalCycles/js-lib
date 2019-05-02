import * as c from 'ansi-colors'
import * as execa from 'execa'

export interface ExecaOptions extends execa.Options {}

export async function proxyCommand (
  cmd: string,
  args: string[] = [],
  opt: ExecaOptions = {},
): Promise<void> {
  const [, , ...processArgs] = process.argv

  await execCommand(cmd, [...args, ...processArgs], {
    ...opt,
  })
}

export async function execCommand (
  cmd: string,
  args: string[] = [],
  opt: ExecaOptions = {},
): Promise<void> {
  logExec(cmd, args, opt)

  await execa(cmd, args, {
    stdio: 'inherit',
    ...opt,
  }).catch(err => {
    if (err && (err.code as any) === 'ENOENT') {
      console.log(`Error: ENOENT (no such file or directory): ${cmd}`)
      process.exit(1)
    } else if (err && typeof err.code === 'number' && err.code) {
      process.exit(err.code)
    } else if (err && typeof err.code === 'string') {
      console.log(`Error: ${err.message}`)
    }

    process.exit(1)
  })
}

/**
 * Convenience method that calls execCommand with `shell: true` option.
 */
export async function execShell (cmd: string, opt: ExecaOptions = {}): Promise<void> {
  await execCommand(cmd, [], {
    shell: true,
    ...opt,
  })
}

export function logExec (cmd: string, args: string[] = [], opt: ExecaOptions = {}): void {
  const cmdline = [
    ...Object.entries(opt.env || {}).map(([k, v]) => [k, v].join('=')),
    cmd,
    ...args,
  ].join(' ')

  console.log(c.grey(cmdline))
}
