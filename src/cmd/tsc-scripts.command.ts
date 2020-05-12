import { _since } from '@naturalcycles/js-lib'
import { boldGrey, dimGrey } from '@naturalcycles/nodejs-lib/dist/colors'
import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { ensureProjectTsconfigScripts } from '../util/tsc.util'

export async function tscScriptsCommand(): Promise<void> {
  if (!fs.existsSync('./scripts')) {
    // ./scripts folder doesn't exist, skipping
    return
  }

  const projectTsconfigPath = await ensureProjectTsconfigScripts()

  const args: string[] = ['-P', projectTsconfigPath, '--noEmit']

  const started = Date.now()
  await execWithArgs(`tsc`, args)
  console.log(`${boldGrey('tsc scripts')} ${dimGrey(`took ` + _since(started))}`)
}
