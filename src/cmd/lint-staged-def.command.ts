import * as fs from 'fs'
import { cfgDir } from '../cnst/paths.cnst'

export async function lintStagedDefCommand(): Promise<void> {
  // const cwd = process.cwd()
  const localConfig = `./lint-staged.config.js`
  const sharedConfig = `${cfgDir}/lint-staged.config.js`
  const config = fs.existsSync(localConfig) ? localConfig : sharedConfig

  // await execWithArgs(`lint-staged`, [`--config`, config])
  const lintStaged = require('lint-staged')
  await lintStaged({
    configPath: config,
  })
}
