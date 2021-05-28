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
  const projectE2eDir = `./e2e`

  const tslintConfigPath = getTSLintConfigPath()
  const tsconfigPath = getTSConfigPath()
  const tsconfigPathScripts = getTSConfigPathScripts()
  const tsconfigPathE2e = `./e2e/tsconfig.json`

  // /src
  await runTSLint(projectSrcDir, lintExclude, tslintConfigPath)
  await runTSLint(projectSrcDir, lintExclude, tslintConfigPath, tsconfigPath)

  // /scripts
  await runTSLint(projectScriptsDir, lintExclude, tslintConfigPath)
  await runTSLint(projectScriptsDir, lintExclude, tslintConfigPath, tsconfigPathScripts)

  // /e2e
  await runTSLint(projectE2eDir, lintExclude, tslintConfigPath)
  await runTSLint(projectE2eDir, lintExclude, tslintConfigPath, tsconfigPathE2e)
}
