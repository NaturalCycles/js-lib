import { runPrettier } from './util/prettier.util'

export async function prettierDoCommand (): Promise<void> {
  await runPrettier()
}
