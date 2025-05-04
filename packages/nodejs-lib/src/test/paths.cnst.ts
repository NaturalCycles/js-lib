import { join } from 'node:path'

export const projectDir = join(import.meta.dirname, `../..`)
export const tmpDir = `${projectDir}/tmp`
export const srcDir = `${projectDir}/src`
export const testDir = `${projectDir}/src/test`
export const secretDir = projectDir + '/secret'
export const scriptsDir = projectDir + '/scripts'
