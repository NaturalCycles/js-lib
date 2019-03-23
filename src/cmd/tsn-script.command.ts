import * as fs from 'fs-extra'
import { projectDir } from '../cnst/paths.cnst'
import { proxyCommand } from '../util/exec.util'
import { nodeModuleExists } from '../util/test.util'

export async function tsnScriptCommand (): Promise<void> {
  // const cwd = process.cwd()
  const projectTsconfigPath = `./scripts/tsconfig.json`
  const sharedTsconfigPath = `${projectDir}/scripts/tsconfig.json`
  const tsconfigPath = fs.pathExistsSync(projectTsconfigPath)
    ? projectTsconfigPath
    : sharedTsconfigPath

  const args: string[] = ['-P', tsconfigPath]

  if (nodeModuleExists('tsconfig-paths')) {
    args.push('-r', 'tsconfig-paths/register')
  }

  await proxyCommand('ts-node', args)
}
