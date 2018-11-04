import * as fs from 'fs-extra'
import { cfgDir } from '../cnst/paths.cnts'

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
