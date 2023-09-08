import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { _since, _truncate } from '@naturalcycles/js-lib'
import {
  boldGrey,
  dimGrey,
  commitMessageToTitleMessage,
  getLastGitCommitMsg,
  gitCommitAll,
  gitHasUncommittedChanges,
  gitPull,
  gitPush,
  execVoidCommandSync,
} from '@naturalcycles/nodejs-lib'
import yargs from 'yargs'
import { runPrettier } from '../util/prettier.util'
import { stylelintAll } from '../util/stylelint.util'
import { eslintAllCommand } from './eslint-all.command'

/**
 * Run all linters.
 */
export async function lintAllCommand(): Promise<void> {
  const started = Date.now()
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

  if (canRunBinary('actionlint')) {
    const st = Date.now()
    execVoidCommandSync(`actionlint`)
    console.log(`${boldGrey('actionlint')} ${dimGrey(`took ` + _since(st))}`)
  } else {
    console.log(
      `actionlint is not installed and won't be run.\nThis is how to install it: https://github.com/rhysd/actionlint/blob/main/docs/install.md`,
    )
  }

  const hadChangesBefore = gitHasUncommittedChanges()

  // We run eslint BEFORE Prettier, because eslint can delete e.g unused imports.
  await eslintAllCommand()

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

  console.log(`${boldGrey('lint-all')} ${dimGrey(`took ` + _since(started))}`)

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

function canRunBinary(name: string): boolean {
  try {
    execSync(`which ${name}`)
    return true
  } catch {
    return false
  }
}
