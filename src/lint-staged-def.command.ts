import * as fs from 'fs-extra'
import { cfgDir } from './cnst/paths.cnst'
import { execCommand } from './util/exec.util'

export async function lintStagedDefCommand (): Promise<void> {
  // const cwd = process.cwd()
  const localConfig = `./lint-staged.config.js`
  const sharedConfig = `${cfgDir}/lint-staged.config.js`
  const config = fs.pathExistsSync(localConfig) ? localConfig : sharedConfig

  await execCommand(`lint-staged`, [`--config`, config])
}
