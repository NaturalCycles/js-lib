import { execCommand } from '@naturalcycles/nodejs-lib'
import { nodeModuleExists } from '../util/test.util'
import { ensureProjectTsconfigScripts } from '../util/tsc.util'

export async function tsnScriptCommand(): Promise<void> {
  const projectTsconfigPath = await ensureProjectTsconfigScripts()

  const [, , ...processArgs] = process.argv

  const args: string[] = [
    '-T',
    '-P',
    projectTsconfigPath,
    '-r',
    'loud-rejection/register',
    '-r',
    'dotenv/config',
  ]

  if (nodeModuleExists('tsconfig-paths')) {
    args.push('-r', 'tsconfig-paths/register')
  }

  await execCommand('ts-node', [...args, ...processArgs])
}
