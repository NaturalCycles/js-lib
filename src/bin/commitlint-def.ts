#!/usr/bin/env node

import * as fs from 'fs'
import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { cfgDir } from '../cnst/paths.cnst'
import { gitCurrentBranchName } from '../util/git.util'

runScript(async () => {
  const editMsg = process.argv[process.argv.length - 1] || '.git/COMMIT_EDITMSG'
  console.log(editMsg)

  const cwd = process.cwd()
  const localConfig = `${cwd}/commitlint.config.js`
  const sharedConfig = `${cfgDir}/commitlint.config.js`
  const config = fs.existsSync(localConfig) ? localConfig : sharedConfig

  const env = { GIT_BRANCH: await gitCurrentBranchName() }
  await execWithArgs(`commitlint`, [`--edit`, editMsg, `--config`, config], { env })
})
