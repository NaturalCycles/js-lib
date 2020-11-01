import { kpySync } from '@naturalcycles/fs-lib'

export function buildCopyCommand(): void {
  const baseDir = 'src'
  const inputPatterns = [
    '**',
    '!**/*.ts',
    '!**/__snapshots__',
    '**/__exclude',
    '!test',
    '!**/*.test.js',
  ]
  const outputDir = 'dist'

  kpySync({
    baseDir,
    inputPatterns,
    outputDir,
    dotfiles: true,
  })
}
