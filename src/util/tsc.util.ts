import * as fs from 'node:fs'
import { execVoidCommand, execVoidCommandSync } from '@naturalcycles/nodejs-lib'
import { _isTruthy, _since } from '@naturalcycles/js-lib'
import { boldGrey, dimGrey } from '@naturalcycles/nodejs-lib/dist/colors'
import { kpySync } from '@naturalcycles/nodejs-lib/dist/fs'
import { cfgDir } from '../cnst/paths.cnst'

export async function tscMainAndScripts(noEmit = false): Promise<void> {
  await Promise.all([tscAsync(noEmit), tscScriptsAsync()])
}

export function tsc(noEmit = false): void {
  const started = Date.now()
  const args = [noEmit && '--noEmit'].filter(_isTruthy)
  execVoidCommandSync('tsc', args)
  console.log(`${boldGrey('tsc')} ${dimGrey(`took ` + _since(started))}`)
}

export async function tscAsync(noEmit = false): Promise<void> {
  const started = Date.now()
  const args = [noEmit && '--noEmit'].filter(_isTruthy)
  await execVoidCommand('tsc', args)
  console.log(`${boldGrey('tsc')} ${dimGrey(`took ` + _since(started))}`)
}

export function tscScripts(): void {
  if (!fs.existsSync('./scripts')) {
    // ./scripts folder doesn't exist, skipping
    return
  }

  const projectTsconfigPath = ensureProjectTsconfigScripts()

  const args: string[] = ['-P', projectTsconfigPath, '--noEmit']

  const started = Date.now()
  execVoidCommandSync(`tsc`, args)
  console.log(`${boldGrey('tsc scripts')} ${dimGrey(`took ` + _since(started))}`)
}

export async function tscScriptsAsync(): Promise<void> {
  if (!fs.existsSync('./scripts')) {
    // ./scripts folder doesn't exist, skipping
    return
  }

  const projectTsconfigPath = ensureProjectTsconfigScripts()

  const args: string[] = ['-P', projectTsconfigPath, '--noEmit']

  const started = Date.now()
  await execVoidCommand(`tsc`, args)
  console.log(`${boldGrey('tsc scripts')} ${dimGrey(`took ` + _since(started))}`)
}

/**
 * Returns path to /scripts/tsconfig.json
 */
export function ensureProjectTsconfigScripts(): string {
  const projectTsconfigPath = `./scripts/tsconfig.json`

  if (!fs.existsSync(projectTsconfigPath)) {
    // You cannot just use a shared `tsconfig.scripts.json` because of relative paths for `include`
    // So, it will be copied into the project

    kpySync({
      baseDir: `${cfgDir}/init/scripts/`,
      inputPatterns: ['tsconfig.json'],
      outputDir: './scripts',
    })

    console.log(`${boldGrey('/scripts/tsconfig.json')} file is automatically added`)
  }

  return projectTsconfigPath
}
