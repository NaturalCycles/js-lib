import * as fs from 'fs-extra'

export function getFullICUPathIfExists (): string | undefined {
  const cwd = process.cwd()
  const path = `${cwd}/node_modules/full-icu`
  return fs.pathExistsSync(path) ? path : undefined
}
