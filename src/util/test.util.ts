import * as fs from 'fs-extra'
import { cfgDir } from '../cnst/paths.cnts'

/**
 * Returns true if module with given name exists in _target project's_ node_modules.
 */
export function nodeModuleExists (moduleName: string): boolean {
  return fs.pathExistsSync(`${process.cwd()}/node_modules/${moduleName}`)
}

export function getFullICUPathIfExists (): string | undefined {
  const cwd = process.cwd()
  const path = `${cwd}/node_modules/full-icu`
  return fs.pathExistsSync(path) ? path : undefined
}

export function getJestConfig (): string | undefined {
  const cwd = process.cwd()
  return fs.pathExistsSync(`${cwd}/jest.config.js`)
    ? undefined
    : `--config=${cfgDir}/jest.config.js`
}

/**
 * Detects if jest is run with all tests, or with specific tests.
 */
export function isRunningAllTests (): boolean {
  const [, , ...args] = process.argv
  const positionalArgs = args.filter(a => !a.startsWith('-'))

  // console.log(process.argv, positionalArgs)

  return !positionalArgs.length
}
