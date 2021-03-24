import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { cfgDir } from '../cnst/paths.cnst'
import { gitCurrentBranchName } from '../util/git.util'

export async function commitlintDefCommand(): Promise<void> {
  const cwd = process.cwd()
  const localConfig = `${cwd}/commitlint.config.js`
  const sharedConfig = `${cfgDir}/commitlint.config.js`
  const config = fs.existsSync(localConfig) ? localConfig : sharedConfig

  const env = { GIT_BRANCH: await gitCurrentBranchName() }
  await execWithArgs(`commitlint`, [`-E`, `HUSKY_GIT_PARAMS`, `--config`, config], { env })
}
