import { _flatten } from '@naturalcycles/js-lib'
import { execWithArgs } from '@naturalcycles/nodejs-lib'
import * as fs from 'fs-extra'
import { cfgDir, scriptsDir } from '../cnst/paths.cnst'

export const tslintExcludePaths: string[] = ['./**/@linked/**', './**/__exclude/**']

/**
 * @returns error code (0 == ok)
 */
export async function runTSLint(
  dir: string,
  excludePaths: string[] = [],
  tslintConfigPath: string,
  tsconfigPath?: string,
): Promise<void> {
  const args = [
    `--config`,
    tslintConfigPath,
    `${dir}/**/*.{ts,tsx}`,
    ..._flatten(excludePaths.map(p => [`-e`, p])),
    ...(tsconfigPath ? [`-p`, tsconfigPath] : []),
    `-t`,
    `stylish`,
    `--fix`,
  ]

  await execWithArgs('tslint', args)
}

export function getTSLintConfigPath(): string {
  const localTSLintConfig = `./tslint.json`
  const sharedTSLintConfig = `${cfgDir}/tslint.config.js`
  return fs.pathExistsSync(localTSLintConfig) ? localTSLintConfig : sharedTSLintConfig
}

export function getTSConfigPath(): string {
  return `./tsconfig.json`
}

export function getTSConfigPathScripts(): string {
  const localTSConfigPathScripts = `./scripts/tsconfig.json`
  const sharedTSConfigScripts = `${scriptsDir}/tsconfig.json`
  return fs.pathExistsSync(localTSConfigPathScripts)
    ? localTSConfigPathScripts
    : sharedTSConfigScripts
}
