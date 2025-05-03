import { join } from 'node:path'

const __filename = import.meta.filename
const __dirname = import.meta.dirname

export const projectDir = join(`${__dirname}/../..`)
export const tmpDir = `${projectDir}/tmp`
