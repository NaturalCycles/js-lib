import * as fs from 'fs-extra'
import { cfgDir } from './cnst/paths.cnst'
import { execCommand } from './util/exec.util'

export async function commitlintDefCommand (): Promise<void> {
  const cwd = process.cwd()
  const localConfig = `${cwd}/commitlint.config.js`
  const sharedConfig = `${cfgDir}/commitlint.config.js`
  const config = (await fs.pathExists(localConfig)) ? localConfig : sharedConfig

  await execCommand(`commitlint -E HUSKY_GIT_PARAMS --config ${config}`)
}
