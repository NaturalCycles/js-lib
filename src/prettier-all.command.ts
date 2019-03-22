import { runPrettier } from './util/prettier.util'

export async function prettierAllCommand (): Promise<void> {
  await runPrettier()
}
