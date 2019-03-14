import { runPrettier, runTSLint } from './util/prettier.util'

export async function lintAllCommand (): Promise<void> {
  await runPrettier()
  await runTSLint()
}
