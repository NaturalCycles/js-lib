import { execWithArgs } from '@naturalcycles/nodejs-lib'
import { nodeModuleExists } from '../util/test.util'

export async function tsnCommand(): Promise<void> {
  const [, , ...processArgs] = process.argv

  const args: string[] = ['-T', '-r', 'loud-rejection/register', '-r', 'dotenv/config']

  if (nodeModuleExists('tsconfig-paths')) {
    args.push('-r', 'tsconfig-paths/register')
  }

  await execWithArgs('ts-node', [...args, ...processArgs])
}
