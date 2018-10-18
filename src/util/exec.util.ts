import chalk from 'chalk'
import { spawn } from 'child_process'

export async function proxyCommand (cmd: string) {
  const [, , ...args] = process.argv

  const cmdWithArgs = [cmd, ...args].join(' ')

  return execCommand(cmdWithArgs)
}

export async function execCommand (cmd: string, exitOnError = true): Promise<number> {
  return new Promise<number>((resolve, reject) => {
    console.log(chalk.grey(cmd))

    const cp = spawn(cmd, { shell: true, stdio: 'inherit' } as any)
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
