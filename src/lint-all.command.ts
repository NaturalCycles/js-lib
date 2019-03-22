import { tslintAllCommand } from './tslint-all.command'
import { runPrettier } from './util/prettier.util'

/**
 * Due to "slowness issue" we run TSLint twice - first without project, secondly - with project.
 *
 * We run tslint BEFORE Prettier and AFTER Prettier, because tslint can delete e.g unused imports.
 *
 * We run TSLint separately for /src and /scripts dir, because they might have a different tsconfig.json file.
 */
export async function lintAllCommand (): Promise<void> {
  await tslintAllCommand()
  await runPrettier()
  await tslintAllCommand()
}
