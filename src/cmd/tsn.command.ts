import { execCommand } from '../util/exec.util'
import { nodeModuleExists } from '../util/test.util'

export async function tsnCommand (): Promise<void> {
  const [, , ...processArgs] = process.argv

  const args: string[] = ['-T']

  if (nodeModuleExists('tsconfig-paths')) {
    args.push('-r', 'tsconfig-paths/register')
  }

  await execCommand('ts-node', [...args, ...processArgs])
}
