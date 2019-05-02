import { kpy } from '@naturalcycles/fs-lib'
import { cfgOverwriteDir } from '../cnst/paths.cnst'

export async function initFromDevLibCommand (): Promise<void> {
  await kpy({
    baseDir: cfgOverwriteDir,
    outputDir: './',
    dotfiles: true,
    verbose: true,
  })
}
