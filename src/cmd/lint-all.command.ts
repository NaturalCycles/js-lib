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
import { eslintAllCommand } from './eslint-all.command'

/**
 * We run eslint BEFORE Prettier, because eslint can delete e.g unused imports.
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

  // Currently we position ESLint before TSLint, but let's monitor if it's ok
  await eslintAllCommand()
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
        process.exitCode = 1
      }
    }
  }
}
