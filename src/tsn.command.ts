import { proxyCommand } from './util/exec.util'
import { nodeModuleExists } from './util/test.util'

export async function tsnCommand (): Promise<void> {
  const args: string[] = []

  if (nodeModuleExists('tsconfig-paths')) {
    args.push('-r', 'tsconfig-paths/register')
  }

  await proxyCommand('ts-node', args)
}
