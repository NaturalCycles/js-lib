import * as yargs from 'yargs'
import {
  getTSConfigPath,
  getTSConfigPathScripts,
  getTSLintConfigPath,
  runTSLint,
} from '../util/tslint.util'
const { lintExclude } = require('../../cfg/_cnst')

/**
 * Runs `tslint` command for all predefined paths (e.g /src, etc).
 */
export async function tslintAllCommand(): Promise<void> {
  const { fix } = yargs.options({
    fix: {
      type: 'boolean',
      default: true,
    },
  }).argv

  const projectSrcDir = `./src`
  const projectScriptsDir = `./scripts`
  const projectE2eDir = `./e2e`

  const tslintConfigPath = getTSLintConfigPath()
  const tsconfigPath = getTSConfigPath()
  const tsconfigPathScripts = getTSConfigPathScripts()
  const tsconfigPathE2e = `./e2e/tsconfig.json`

  // /src
  await runTSLint(projectSrcDir, lintExclude, tslintConfigPath, undefined, fix)
  await runTSLint(projectSrcDir, lintExclude, tslintConfigPath, tsconfigPath, fix)

  // /scripts
  await runTSLint(projectScriptsDir, lintExclude, tslintConfigPath, undefined, fix)
  await runTSLint(projectScriptsDir, lintExclude, tslintConfigPath, tsconfigPathScripts, fix)

  // /e2e
  await runTSLint(projectE2eDir, lintExclude, tslintConfigPath, undefined, fix)
  await runTSLint(projectE2eDir, lintExclude, tslintConfigPath, tsconfigPathE2e, fix)
}
