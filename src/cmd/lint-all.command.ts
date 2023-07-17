import * as fs from 'node:fs'
import { _truncate } from '@naturalcycles/js-lib'
import * as yargs from 'yargs'
import {
  commitMessageToTitleMessage,
  getLastGitCommitMsg,
  gitCommitAll,
  gitHasUncommittedChanges,
  gitPull,
  gitPush,
} from '@naturalcycles/nodejs-lib'
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

  const hadChangesBefore = gitHasUncommittedChanges()

  eslintAllCommand()

  if (
    fs.existsSync(`node_modules/stylelint`) &&
    fs.existsSync(`node_modules/stylelint-config-standard-scss`)
  ) {
    stylelintAll()
  }

  runPrettier()

  if (fs.existsSync(`node_modules/@naturalcycles/ktlint`)) {
    const ktlintLib = require('@naturalcycles/ktlint')
    await ktlintLib.ktlintAll()
  }

  if (commitOnChanges || failOnChanges) {
    // detect changes
    const hasChanges = gitHasUncommittedChanges()
    if (hasChanges) {
      if (hadChangesBefore) {
        console.log(`lint-all: there are changes before running lint-all, will not commit`)
      } else {
        const msg =
          'style(ci): ' + _truncate(commitMessageToTitleMessage(getLastGitCommitMsg()), 60)

        // pull, commit, push changes
        gitPull()
        gitCommitAll(msg)
        gitPush()
      }

      // fail on changes
      if (failOnChanges) {
        console.log('lint-all failOnChanges: exiting with status 1')
        process.exitCode = 1
      }
    }
  }
}
