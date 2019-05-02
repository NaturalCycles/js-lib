import { kpy } from '@naturalcycles/fs-lib'

export async function buildCopyCommand (): Promise<void> {
  const baseDir = 'src'
  const inputPatterns = ['**', '!**/*.{ts,js}', '!**/__snapshots__', '**/__exclude', '!test']
  const outputDir = 'dist'

  await kpy({
    baseDir,
    inputPatterns,
    outputDir,
  })
}
