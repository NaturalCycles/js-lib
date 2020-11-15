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
  const projectSrcDir = `./src`
  const projectScriptsDir = `./scripts`

  const tslintConfigPath = getTSLintConfigPath()
  const tsconfigPath = getTSConfigPath()
  const tsconfigPathScripts = getTSConfigPathScripts()

  // /src
  await runTSLint(projectSrcDir, lintExclude, tslintConfigPath)
  await runTSLint(projectSrcDir, lintExclude, tslintConfigPath, tsconfigPath)
  // /scripts
  await runTSLint(projectScriptsDir, lintExclude, tslintConfigPath)
  await runTSLint(projectScriptsDir, lintExclude, tslintConfigPath, tsconfigPathScripts)
}
