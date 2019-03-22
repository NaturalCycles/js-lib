import { runPrettier } from './util/prettier.util'
import {
  getTSConfigPath,
  getTSConfigPathScripts,
  getTSLintConfigPath,
  runTSLint,
  tslintExcludePaths,
} from './util/tslint.util'

/**
 * Due to "slowness issue" we run TSLint twice - first without project, secondly - with project.
 *
 * We run tslint BEFORE Prettier and AFTER Prettier, because tslint can delete e.g unused imports.
 *
 * We run TSLint separately for /src and /scripts dir, because they might have a different tsconfig.json file.
 */
export async function lintAllCommand (): Promise<void> {
  const projectSrcDir = `./src`
  const projectScriptsDir = `./scripts`

  const tslintConfigPath = getTSLintConfigPath()
  const tsconfigPath = getTSConfigPath()
  const tsconfigPathScripts = getTSConfigPathScripts()

  // Due to "slowness issue" we run TSLint twice - first without project, secondly - with project
  // This makes it way faster

  // 2 passes of TSLint (which will e.g remove some unused imports)
  // /src
  await runTSLint(projectSrcDir, tslintExcludePaths, tslintConfigPath)
  await runTSLint(projectSrcDir, tslintExcludePaths, tslintConfigPath, tsconfigPath)
  // /scripts
  await runTSLint(projectScriptsDir, tslintExcludePaths, tslintConfigPath)
  await runTSLint(projectScriptsDir, tslintExcludePaths, tslintConfigPath, tsconfigPathScripts)

  // 1 pass of Prettier
  await runPrettier()

  // 2 passes of TSLint again
  // /src
  await runTSLint(projectSrcDir, tslintExcludePaths, tslintConfigPath)
  await runTSLint(projectSrcDir, tslintExcludePaths, tslintConfigPath, tsconfigPath)
  // /scripts
  await runTSLint(projectScriptsDir, tslintExcludePaths, tslintConfigPath)
  await runTSLint(projectScriptsDir, tslintExcludePaths, tslintConfigPath, tsconfigPathScripts)
}
