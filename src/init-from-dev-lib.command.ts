import { kpySync } from '@naturalcycles/nodejs-lib'
import { cfgOverwriteDir } from './paths.js'

export function initFromDevLibCommand(): void {
  kpySync({
    baseDir: cfgOverwriteDir,
    outputDir: './',
    dotfiles: true,
    verbose: true,
  })
}
