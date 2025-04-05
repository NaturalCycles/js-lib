import { join } from 'node:path'

export const projectDir = join(__dirname, '..')
export const srcDir = `${projectDir}/src`
export const testDir = `${srcDir}/test`
export const cfgDir = `${projectDir}/cfg`
export const cfgOverwriteDir = `${projectDir}/cfg/overwrite`
export const scriptsDir = `${projectDir}/scripts`
