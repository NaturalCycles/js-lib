import chalk from 'chalk'
import { spawn } from 'child_process'

export async function proxyCommand (cmd: string): Promise<number> {
  const [, , ...args] = process.argv

  return execCommand(cmd, args)
}

export async function execCommand (
  cmd: string,
  args: string[] = [],
  exitOnError = true,
): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    console.log(chalk.grey([cmd, ...args].join(' ')))

    const cp = spawn(cmd, args, { shell: true, stdio: 'inherit' } as any)
    // cp.stdout.on('data', data => console.log(data.toString()))
    // cp.stderr.on('data', data => console.log(data.toString()))
    cp.once('error', err => reject(err))
    cp.once('close', code => {
      // console.log('close: ' + code)
      if (code) {
        if (exitOnError) {
          process.exit(code)
        }

        reject(new Error(`${cmd} exitCode: ${code}`))
      } else {
        resolve(code)
      }
    })
  })
}
