import { execWithArgs } from '@naturalcycles/nodejs-lib'
import * as fs from 'fs-extra'
import { ensureProjectTsconfigScripts } from '../util/tsc.util'

export async function tscScriptsCommand(): Promise<void> {
  if (!fs.existsSync('./scripts')) {
    // ./scripts folder doesn't exist, skipping
    return
  }

  const projectTsconfigPath = await ensureProjectTsconfigScripts()

  const args: string[] = ['-P', projectTsconfigPath, '--noEmit']

  await execWithArgs(`tsc`, args)
}
