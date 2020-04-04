import * as fs from 'fs'

/**
 * Returns true if module with given name exists in _target project's_ node_modules.
 */
export function nodeModuleExists(moduleName: string): boolean {
  return fs.existsSync(`./node_modules/${moduleName}`)
}

export function getFullICUPathIfExists(): string | undefined {
  const path = `./node_modules/full-icu`
  return fs.existsSync(path) ? path : undefined
}
