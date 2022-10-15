import * as fs from 'node:fs'

/**
 * Returns true if module with given name exists in _target project's_ node_modules.
 */
export function nodeModuleExists(moduleName: string): boolean {
  return fs.existsSync(`./node_modules/${moduleName}`)
}
