import { kpy } from '@naturalcycles/fs-lib'
import { boldGrey } from '@naturalcycles/nodejs-lib/dist/colors'
import { execCommand } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs-extra'
import { cfgDir } from '../cnst/paths.cnst'

export async function tsc(): Promise<void> {
  await execCommand('tsc')
}

/**
 * Returns path to /scripts/tsconfig.json
 */
export async function ensureProjectTsconfigScripts(): Promise<string> {
  const projectTsconfigPath = `./scripts/tsconfig.json`

  if (!fs.pathExistsSync(projectTsconfigPath)) {
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
