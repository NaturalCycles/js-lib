import { dimGrey } from '@naturalcycles/nodejs-lib/dist/colors'
import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { nodeModuleExists } from '../util/test.util'
import { ensureProjectTsconfigScripts } from '../util/tsc.util'

export async function tsnCommand(): Promise<void> {
  const projectTsconfigPath = await ensureProjectTsconfigScripts()

  let [, , scriptPath = '', ...processArgs] = process.argv

  // Prepend ./scripts/ if needed
  if (
    !scriptPath.startsWith('scripts/') &&
    !scriptPath.startsWith('./') &&
    !scriptPath.startsWith('/')
  ) {
    const newPath = './scripts/' + scriptPath
    if (fs.existsSync(newPath)) {
      scriptPath = newPath
    }
  }

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

  const { NODE_OPTIONS } = process.env

  if (NODE_OPTIONS) {
    console.log(`${dimGrey('NODE_OPTIONS: ' + NODE_OPTIONS)}`)
  } else {
    console.log(`${dimGrey('NODE_OPTIONS are not defined')}`)
  }

  await execWithArgs('ts-node', [...args, scriptPath, ...processArgs])
}
