import * as fs from 'fs'
import * as yargs from 'yargs'
import { cfgDir } from '../cnst/paths.cnst'
import { getTSConfigPathScripts, runESLint } from '../util/lint.util'

/**
 * Runs `eslint` command for all predefined paths (e.g /src, /scripts, etc).
 */
export async function eslintAllCommand(): Promise<void> {
  const { ext, fix } = yargs.options({
    ext: {
      type: 'string',
      default: 'ts,tsx,vue',
    },
    fix: {
      type: 'boolean',
      default: true,
    },
  }).argv

  const extensions = ext.split(',')

  const eslintConfigPathRoot =
    ['./.eslintrc.js'].find(p => fs.existsSync(p)) || `${cfgDir}/eslint.config.js`
  const eslintConfigPathScripts =
    ['./scripts/.eslintrc.js', './.eslintrc.js'].find(p => fs.existsSync(p)) ||
    `${cfgDir}/eslint.config.js`
  const eslintConfigPathE2e =
    ['./e2e/.eslintrc.js', './.eslintrc.js'].find(p => fs.existsSync(p)) ||
    `${cfgDir}/eslint.config.js`

  // const tsconfigPath = getTSConfigPath()
  const tsconfigPathScripts = getTSConfigPathScripts()
  const tsconfigPathE2e = `./e2e/tsconfig.json`

  // /src
  // await runESLint(`./src`, eslintConfigPathRoot, tsconfigPath, extensions)
  await runESLint(`./src`, eslintConfigPathRoot, undefined, extensions, fix)

  // /scripts
  await runESLint(`./scripts`, eslintConfigPathScripts, tsconfigPathScripts, undefined, fix)

  // /e2e
  await runESLint(`./e2e`, eslintConfigPathE2e, tsconfigPathE2e, undefined, fix)
}
