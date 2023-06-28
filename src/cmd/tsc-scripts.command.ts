import * as fs from 'node:fs'
import { _since } from '@naturalcycles/js-lib'
import { boldGrey, dimGrey } from '@naturalcycles/nodejs-lib/dist/colors'
import { execVoidCommandSync } from '../util/exec.util'
import { ensureProjectTsconfigScripts } from '../util/tsc.util'

export function tscScriptsCommand(): void {
  if (!fs.existsSync('./scripts')) {
    // ./scripts folder doesn't exist, skipping
    return
  }

  const projectTsconfigPath = ensureProjectTsconfigScripts()

  const args: string[] = ['-P', projectTsconfigPath, '--noEmit']

  const started = Date.now()
  execVoidCommandSync(`tsc`, args)
  console.log(`${boldGrey('tsc scripts')} ${dimGrey(`took ` + _since(started))}`)
}
