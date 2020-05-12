import { kpy } from '@naturalcycles/fs-lib'
import { _since } from '@naturalcycles/js-lib'
import { boldGrey, dimGrey } from '@naturalcycles/nodejs-lib/dist/colors'
import { execCommand } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { cfgDir } from '../cnst/paths.cnst'

export async function tsc(): Promise<void> {
  const started = Date.now()
  await execCommand('tsc')
  console.log(`${boldGrey('tsc')} ${dimGrey(`took ` + _since(started))}`)
}

/**
 * Returns path to /scripts/tsconfig.json
 */
export async function ensureProjectTsconfigScripts(): Promise<string> {
  const projectTsconfigPath = `./scripts/tsconfig.json`

  if (!fs.existsSync(projectTsconfigPath)) {
    // You cannot just use a shared `tsconfig.scripts.json` because of relative paths for `include`
    // So, it will be copied into the project

    await kpy({
      baseDir: `${cfgDir}/init/scripts/`,
      inputPatterns: ['tsconfig.json'],
      outputDir: './scripts',
    })

    console.log(`${boldGrey('/scripts/tsconfig.json')} file is automatically added`)
  }

  return projectTsconfigPath
}
