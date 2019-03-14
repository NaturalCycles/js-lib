import { proxyCommand } from './util/exec.util'
import { nodeModuleExists } from './util/test.util'

export async function tsnCommand (): Promise<void> {
  const cmd = ['ts-node', nodeModuleExists('tsconfig-paths') && '-r tsconfig-paths/register']
    .filter(t => t)
    .join(' ')

  await proxyCommand(cmd)
}
