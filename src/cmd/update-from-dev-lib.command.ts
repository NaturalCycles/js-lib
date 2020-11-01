import { kpySync } from '@naturalcycles/fs-lib'
import { cfgOverwriteDir } from '../cnst/paths.cnst'

export function updateFromDevLibCommand(): void {
  kpySync({
    baseDir: cfgOverwriteDir,
    outputDir: './',
    dotfiles: true,
    verbose: true,
  })
}
