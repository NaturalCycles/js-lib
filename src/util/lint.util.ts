import * as fs from 'node:fs'
import { scriptsDir } from '../cnst/paths.cnst'
import { execVoidCommandSync } from './exec.util'

export function getTSConfigPath(): string {
  // this is to support "Solution style tsconfig.json" (as used in Angular10, for example)
  // return [`./tsconfig.base.json`].find(p => fs.existsSync(p)) || `./tsconfig.json`
  return './tsconfig.json'
}

export function getTSConfigPathScripts(): string {
  return [`./scripts/tsconfig.json`].find(p => fs.existsSync(p)) || `${scriptsDir}/tsconfig.json`
}

export function runESLint(
  dir: string,
  eslintConfigPath: string,
  tsconfigPath: string | undefined,
  extensions = ['ts', 'tsx', 'vue'],
  fix = true,
): void {
  if (!fs.existsSync(dir)) return // faster to bail-out like this

  const args = [
    `--config`,
    eslintConfigPath,
    `${dir}/**/*.{${extensions.join(',')}}`,
    ...(tsconfigPath ? [`--parser-options=project:${tsconfigPath}`] : []),
    `--no-error-on-unmatched-pattern`,
    `--report-unused-disable-directives`,
    fix ? `--fix` : '',
  ].filter(Boolean)

  execVoidCommandSync('eslint', args)
}
