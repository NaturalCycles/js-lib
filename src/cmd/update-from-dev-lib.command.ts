import { kpySync } from '@naturalcycles/nodejs-lib'
import { cfgOverwriteDir } from '../cnst/paths.cnst'

export function updateFromDevLibCommand(): void {
  kpySync({
    baseDir: cfgOverwriteDir,
    outputDir: './',
    dotfiles: true,
    verbose: true,
  })
}
