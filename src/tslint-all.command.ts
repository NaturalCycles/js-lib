import { runTSLint } from './util/prettier.util'

/**
 * Runs `tslint` command for all predefined paths (e.g /src, etc).
 */
export async function tslintAllCommand (): Promise<void> {
  await runTSLint()
}
