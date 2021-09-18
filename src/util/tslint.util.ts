import { _flatten } from '@naturalcycles/js-lib'
import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { cfgDir, scriptsDir } from '../cnst/paths.cnst'

export async function runTSLint(
  dir: string,
  excludePaths: string[] = [],
  tslintConfigPath: string,
  tsconfigPath?: string,
  fix = true,
): Promise<void> {
  if (!fs.existsSync(dir)) return // faster like this

  const args = [
    `--config`,
    tslintConfigPath,
    `${dir}/**/*.{ts,tsx}`,
    ..._flatten(excludePaths.map(p => [`-e`, p])),
    ...(tsconfigPath ? [`-p`, tsconfigPath] : []),
    `-t`,
    `stylish`,
    fix ? `--fix` : '',
  ].filter(Boolean)

  await execWithArgs('tslint', args)
}

export function getTSLintConfigPath(): string {
  const localTSLintConfig = `./tslint.json`
  const sharedTSLintConfig = `${cfgDir}/tslint.config.js`
  return fs.existsSync(localTSLintConfig) ? localTSLintConfig : sharedTSLintConfig
}

export function getTSConfigPath(): string {
  // this is to support "Solution style tsconfig.json" (as used in Angular10, for example)
  // return [`./tsconfig.base.json`].find(p => fs.existsSync(p)) || `./tsconfig.json`
  return './tsconfig.json'
}

export function getTSConfigPathScripts(): string {
  return [`./scripts/tsconfig.json`].find(p => fs.existsSync(p)) || `${scriptsDir}/tsconfig.json`
}

export async function runESLint(
  dir: string,
  eslintConfigPath: string,
  tsconfigPath: string | undefined,
  extensions = ['ts', 'tsx', 'vue'],
  fix = true,
): Promise<void> {
  if (!fs.existsSync(dir)) return // faster to bail-out like this

  const args = [
    `--config`,
    eslintConfigPath,
    `${dir}/**/*.{${extensions.join(',')}}`,
    ...(tsconfigPath ? [`--parser-options=project:${tsconfigPath}`] : []),
    `--no-error-on-unmatched-pattern`,
    fix ? `--fix` : '',
  ].filter(Boolean)

  await execWithArgs('eslint', args)
}
