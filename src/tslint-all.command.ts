import {
  getTSConfigPath,
  getTSConfigPathScripts,
  getTSLintConfigPath,
  runTSLint,
  tslintExcludePaths
} from './util/tslint.util'

/**
 * Runs `tslint` command for all predefined paths (e.g /src, etc).
 */
export async function tslintAllCommand (): Promise<void> {
  const projectSrcDir = `./src`
  const projectScriptsDir = `./scripts`

  const tslintConfigPath = getTSLintConfigPath()
  const tsconfigPath = getTSConfigPath()
  const tsconfigPathScripts = getTSConfigPathScripts()

  // /src
  await runTSLint(projectSrcDir, tslintExcludePaths, tslintConfigPath)
  await runTSLint(projectSrcDir, tslintExcludePaths, tslintConfigPath, tsconfigPath)
  // /scripts
  await runTSLint(projectScriptsDir, tslintExcludePaths, tslintConfigPath)
  await runTSLint(projectScriptsDir, tslintExcludePaths, tslintConfigPath, tsconfigPathScripts)
}
