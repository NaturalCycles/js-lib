import * as fs from 'fs'
import { cfgDir } from '../cnst/paths.cnst'
import { getTSConfigPath, getTSConfigPathScripts, runESLint } from '../util/tslint.util'

/**
 * Runs `eslint` command for all predefined paths (e.g /src, /scripts, etc).
 */
export async function eslintAllCommand(): Promise<void> {
  const eslintConfigPathRoot =
    ['./.eslintrc.js'].find(p => fs.existsSync(p)) || `${cfgDir}/eslint.config.js`
  const eslintConfigPathScripts =
    ['./scripts/.eslintrc.js', './.eslintrc.js'].find(p => fs.existsSync(p)) ||
    `${cfgDir}/eslint.config.js`
  const eslintConfigPathE2e =
    ['./e2e/.eslintrc.js', './.eslintrc.js'].find(p => fs.existsSync(p)) ||
    `${cfgDir}/eslint.config.js`

  const tsconfigPath = getTSConfigPath()
  const tsconfigPathScripts = getTSConfigPathScripts()
  const tsconfigPathE2e = `./e2e/tsconfig.json`

  // /src
  await runESLint(`./src`, eslintConfigPathRoot, tsconfigPath)

  // /scripts
  await runESLint(`./scripts`, eslintConfigPathScripts, tsconfigPathScripts)

  // /e2e
  await runESLint(`./e2e`, eslintConfigPathE2e, tsconfigPathE2e)
}
