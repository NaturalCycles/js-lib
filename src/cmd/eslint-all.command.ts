import {
  getESLintConfigPath,
  getTSConfigPath,
  getTSConfigPathScripts,
  runESLint,
} from '../util/tslint.util'

/**
 * Runs `eslint` command for all predefined paths (e.g /src, /scripts, etc).
 */
export async function eslintAllCommand(): Promise<void> {
  const projectSrcDir = `./src`
  const projectScriptsDir = `./scripts`

  const configPath = getESLintConfigPath()
  const tsconfigPath = getTSConfigPath()
  const tsconfigPathScripts = getTSConfigPathScripts()

  // /src
  await runESLint(projectSrcDir, configPath, tsconfigPath)

  // /scripts
  await runESLint(projectScriptsDir, configPath, tsconfigPathScripts)
}
