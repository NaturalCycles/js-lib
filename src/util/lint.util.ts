import fs from 'node:fs'
import { execVoidCommand, execVoidCommandSync } from '@naturalcycles/nodejs-lib'
import { scriptsDir } from '../cnst/paths.cnst'

const ESLINT_USE_FLAT_CONFIG = 'false'

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
  tsconfigPath?: string,
  extensions = ['ts', 'tsx', 'vue'],
  fix = true,
): void {
  if (!fs.existsSync(dir)) return // faster to bail-out like this

  execVoidCommandSync(
    'eslint',
    getEslintArgs(dir, eslintConfigPath, tsconfigPath, extensions, fix),
    {
      env: {
        ESLINT_USE_FLAT_CONFIG,
      },
    },
  )
}

export async function runESLintAsync(
  dir: string,
  eslintConfigPath: string,
  tsconfigPath?: string,
  extensions = ['ts', 'tsx', 'vue'],
  fix = true,
): Promise<void> {
  if (!fs.existsSync(dir)) return // faster to bail-out like this

  await execVoidCommand(
    'eslint',
    getEslintArgs(dir, eslintConfigPath, tsconfigPath, extensions, fix),
    {
      env: {
        ESLINT_USE_FLAT_CONFIG,
      },
    },
  )
}

function getEslintArgs(
  dir: string,
  eslintConfigPath: string,
  tsconfigPath?: string,
  extensions = ['ts', 'tsx', 'vue'],
  fix = true,
): string[] {
  return [
    `--config`,
    eslintConfigPath,
    `${dir}/**/*.{${extensions.join(',')}}`,
    ...(tsconfigPath ? [`--parser-options=project:${tsconfigPath}`] : []),
    `--no-error-on-unmatched-pattern`,
    `--report-unused-disable-directives`,
    fix ? `--fix` : '',
  ].filter(Boolean)
}
