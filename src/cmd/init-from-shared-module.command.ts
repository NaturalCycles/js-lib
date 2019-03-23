import { kpy } from 'kpy'
import { cfgOverwriteDir } from '../cnst/paths.cnst'

export async function initFromSharedModuleCommand (): Promise<void> {
  await kpy({
    baseDir: cfgOverwriteDir,
    outputDir: './',
    dotfiles: true,
    verbose: true,
  })
}
