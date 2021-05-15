import { _flatten } from '@naturalcycles/js-lib'
import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { cfgDir, scriptsDir } from '../cnst/paths.cnst'

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
  return fs.existsSync(localTSLintConfig) ? localTSLintConfig : sharedTSLintConfig
}

export function getTSConfigPath(): string {
  const defaultTSConfigPath = './tsconfig.json'
  const baseTSConfigPath = './tsconfig.base.json' // this is to support "Solution style tsconfig.json" (as used in Angular10, for example)
  return fs.existsSync(baseTSConfigPath) ? baseTSConfigPath : defaultTSConfigPath
}

export function getTSConfigPathScripts(): string {
  const localTSConfigPathScripts = `./scripts/tsconfig.json`
  const sharedTSConfigScripts = `${scriptsDir}/tsconfig.json`
  return fs.existsSync(localTSConfigPathScripts) ? localTSConfigPathScripts : sharedTSConfigScripts
}

export function getESLintConfigPath(): string {
  const localConfig = `./.eslintrc.js`
  const sharedConfig = `${cfgDir}/eslint.config.js`
  return fs.existsSync(localConfig) ? localConfig : sharedConfig
}

export async function runESLint(
  dir: string,
  configPath: string,
  tsconfigPath?: string,
): Promise<void> {
  const args = [
    `--config`,
    configPath,
    `${dir}/**/*.{ts,tsx}`,
    ...(tsconfigPath ? [`--parser-options=project:${tsconfigPath}`] : []),
    `--fix`,
  ]

  await execWithArgs('eslint', args)
}
