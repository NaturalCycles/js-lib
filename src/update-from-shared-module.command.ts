import { kpy } from 'kpy'
import { cfgOverwriteDir } from './cnst/paths.cnts'

export async function updateFromSharedModuleCommand (): Promise<void> {
  await kpy({
    baseDir: cfgOverwriteDir,
    outputDir: './',
    dotfiles: true,
    verbose: true,
  })
}
