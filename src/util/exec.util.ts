import * as c from 'ansi-colors'
import { spawn, SpawnOptions } from 'child_process'

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
  return new Promise<void>((resolve, reject) => {
    const cmdline = [
      ...Object.entries(opt.env || {}).map(([k, v]) => [k, v].join('=')),
      cmd,
      ...args,
    ].join(' ')

    console.log(c.grey(cmdline))

    const cp = spawn(cmd, args, {
      stdio: 'inherit',
      ...opt,
      env: {
        ...process.env,
        ...opt.env,
      },
    })

    let _rejected = false

    cp.once('error', err => {
      _rejected = true
      reject(err)
    })
    cp.once('close', code => {
      // console.log('close: ' + code)
      if (code) {
        process.exit(code)
        // setTimeout(() => process.exit(code), 100)
        // reject(new Error(`${cmd} exitCode: ${code}`))
      } else {
        resolve()
      }
    })
  })
}
