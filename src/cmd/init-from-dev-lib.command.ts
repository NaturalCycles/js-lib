import { kpySync } from '@naturalcycles/nodejs-lib/dist/fs'
import { cfgOverwriteDir } from '../cnst/paths.cnst'

export function initFromDevLibCommand(): void {
  kpySync({
    baseDir: cfgOverwriteDir,
    outputDir: './',
    dotfiles: true,
    verbose: true,
  })
}
