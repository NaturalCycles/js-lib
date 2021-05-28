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
  const projectE2eDir = `./e2e`

  const eslintConfigPath = getESLintConfigPath()
  const tsconfigPath = getTSConfigPath()
  const tsconfigPathScripts = getTSConfigPathScripts()
  const tsconfigPathE2e = `./e2e/tsconfig.json`

  // /src
  await runESLint(projectSrcDir, eslintConfigPath, tsconfigPath)

  // /scripts
  await runESLint(projectScriptsDir, eslintConfigPath, tsconfigPathScripts)

  // /e2e
  await runESLint(projectE2eDir, eslintConfigPath, tsconfigPathE2e)
}
