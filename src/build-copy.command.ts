import { kpy } from 'kpy'

export async function buildCopyCommand (): Promise<void> {
  const baseDir = 'src'
  const inputPatterns = ['**', '!**/*.{ts,js}', '!**/__snapshots__', '**/_exclude', '!test']
  const outputDir = 'dist'

  await kpy({
    baseDir,
    inputPatterns,
    outputDir,
  })
}
