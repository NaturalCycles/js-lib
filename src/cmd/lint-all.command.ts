import * as yargs from 'yargs'
import {
  commitMessageToTitleMessage,
  getLastGitCommitMsg,
  gitCommitAll,
  gitHasUncommittedChanges,
  gitPull,
  gitPush,
} from '../util/git.util'
import { runPrettier } from '../util/prettier.util'
import { stylelintAll } from '../util/stylelint.util'
import { tslintAllCommand } from './tslint-all.command'

/**
 * Due to "slowness issue" we run TSLint twice - first without project, secondly - with project.
 *
 * We run tslint BEFORE Prettier, because tslint can delete e.g unused imports.
 *
 * We run TSLint separately for /src and /scripts dir, because they might have a different tsconfig.json file.
 */
export async function lintAllCommand(): Promise<void> {
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

  const hadChangesBefore = await gitHasUncommittedChanges()

  await tslintAllCommand()
  await stylelintAll()
  await runPrettier()

  if (commitOnChanges || failOnChanges) {
    // detect changes
    const hasChanges = await gitHasUncommittedChanges()
    if (hasChanges) {
      if (hadChangesBefore) {
        console.log(`lint-all: there are changes before running lint-all, will not commit`)
      } else {
        const msg =
          'style(lint-all): ' +
          commitMessageToTitleMessage(await getLastGitCommitMsg()) +
          '\n\n[skip ci]'

        // pull, commit, push changes
        await gitPull()
        await gitCommitAll(msg)
        await gitPush()
      }

      // fail on changes
      if (failOnChanges) {
        console.log('lint-all failOnChanges: exiting with status 1')
        process.exit(1)
      }
    }
  }
}
