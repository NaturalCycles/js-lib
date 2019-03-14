import * as fs from 'fs-extra'
import { projectDir } from './cnst/paths.cnts'
import { proxyCommand } from './util/exec.util'
import { nodeModuleExists } from './util/test.util'

export async function tsnScriptCommand (): Promise<void> {
  const cwd = process.cwd()
  const projectTsconfigPath = `${cwd}/scripts/tsconfig.json`
  const sharedTsconfigPath = `${projectDir}/scripts/tsconfig.json`
  const tsconfigPath = (await fs.pathExists(projectTsconfigPath))
    ? projectTsconfigPath
    : sharedTsconfigPath

  const cmd = [
    'ts-node',
    nodeModuleExists('tsconfig-paths') && '-r tsconfig-paths/register',
    `-P ${tsconfigPath}`,
  ]
    .filter(t => t)
    .join(' ')

  await proxyCommand(cmd)
}
