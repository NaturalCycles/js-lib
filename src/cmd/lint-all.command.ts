import * as yargs from 'yargs'
import {
  commitMessageToTitleMessage,
  getLastGitCommitMsg,
  gitCommitAll,
  gitHasUncommittedChanges,
  gitPush,
} from '../util/git.util'
import { runPrettier } from '../util/prettier.util'
import { tslintAllCommand } from './tslint-all.command'

/**
 * Due to "slowness issue" we run TSLint twice - first without project, secondly - with project.
 *
 * We run tslint BEFORE Prettier and AFTER Prettier, because tslint can delete e.g unused imports.
 *
 * We run TSLint separately for /src and /scripts dir, because they might have a different tsconfig.json file.
 */
export async function lintAllCommand (): Promise<void> {
  const { commitOnChanges, failOnChanges } = yargs.options({
    commitOnChanges: {
      type: 'boolean',
      default: false,
    },
    failOnChanges: {
      type: 'boolean',
      default: false,
    },
  }).argv

  await tslintAllCommand()
  await runPrettier()
  await tslintAllCommand()

  if (commitOnChanges || failOnChanges) {
    // detect changes
    const hasChanges = await gitHasUncommittedChanges()
    if (hasChanges) {
      const msg =
        'style(lint-all): ' +
        commitMessageToTitleMessage(await getLastGitCommitMsg()) +
        '\n\n[skip ci]'

      // commit & push changes
      await gitCommitAll(msg)
      await gitPush()

      // fail on changes
      if (failOnChanges) {
        console.log('lint-all failOnChanges: exiting with status 1')
        process.exit(1)
      }
    }
  }
}
