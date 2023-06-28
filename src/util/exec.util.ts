import { ProcessEnvOptions, SpawnOptions } from 'node:child_process'
import * as cp from 'node:child_process'
import { grey } from '@naturalcycles/nodejs-lib/dist/colors'
import ErrnoException = NodeJS.ErrnoException

export async function execVoidCommand(
  cmd: string,
  args: string[] = [],
  opt: SpawnOptions = {},
): Promise<void> {
  logExec(cmd, args, opt)

  await new Promise<void>(resolve => {
    const p = cp.spawn(cmd, [...args], {
      stdio: 'inherit',
      // shell: true,
      ...opt,
      env: {
        ...process.env,
        ...opt.env,
      },
    })

    p.on('close', code => {
      if (!code) return resolve()
      console.log(`${cmd} exited with code ${code}`)
      process.exit(code)
    })
  })
}

export function execVoidCommandSync(
  cmd: string,
  args: string[] = [],
  opt: SpawnOptions = {},
): void {
  logExec(cmd, args, opt)

  const r = cp.spawnSync(cmd, [...args], {
    encoding: 'utf8',
    stdio: 'inherit',
    // shell: true, // removing shell breaks executing `tsc`
    ...opt,
    env: {
      ...process.env,
      ...opt.env,
    },
  })

  if (r.status) {
    console.log(`${cmd} exited with code ${r.status}`)
    process.exit(r.status)
  }

  if (r.error) {
    console.log(r.error)
    process.exit((r.error as ErrnoException).errno || 1)
  }
}

function logExec(cmd: string, args: string[] = [], opt: ProcessEnvOptions = {}): void {
  const cmdline = [
    ...Object.entries(opt.env || {}).map(([k, v]) => [k, v].join('=')),
    cmd,
    ...args,
  ].join(' ')

  console.log(grey(cmdline))
}
