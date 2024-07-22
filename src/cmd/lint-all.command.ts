import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { _since, _truncate } from '@naturalcycles/js-lib'
import {
  boldGrey,
  commitMessageToTitleMessage,
  dimGrey,
  execVoidCommandSync,
  getLastGitCommitMsg,
  gitCommitAll,
  gitHasUncommittedChanges,
  gitPull,
  gitPush,
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

  // todo: produce a cleaner "list of changed files"
  let gitStatusAtStart: string | undefined
  const hadChangesBefore = gitHasUncommittedChanges()
  if ((commitOnChanges || failOnChanges) && hadChangesBefore) {
    console.log('lint-all: git shows changes before run:')
    gitStatusAtStart = gitStatus()
    console.log(gitStatusAtStart)
  }

  // We run eslint BEFORE Prettier, because eslint can delete e.g unused imports.
  await eslintAllCommand()

  if (
    fs.existsSync(`node_modules/stylelint`) &&
    fs.existsSync(`node_modules/stylelint-config-standard-scss`)
  ) {
    stylelintAll()
  }

  runPrettier()

  runActionLint()

  await runKTLint()

  console.log(`${boldGrey('lint-all')} ${dimGrey(`took ` + _since(started))}`)

  if (commitOnChanges || failOnChanges) {
    // detect changes
    const hasChanges = gitHasUncommittedChanges()
    if (hasChanges) {
      const gitStatusAfter = gitStatus()
      if (gitStatusAfter === gitStatusAtStart) {
        console.log(`lint-all: git status is the same as before the run, will not commit`)
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
        console.log(gitStatusAfter)
        console.log('lint-all failOnChanges: exiting with status 1')
        process.exitCode = 1
      }
    }
  }
}

async function runKTLint(): Promise<void> {
  if (fs.existsSync(`node_modules/@naturalcycles/ktlint`)) {
    const ktlintLib = require('@naturalcycles/ktlint')
    await ktlintLib.ktlintAll()
  }
}

function runActionLint(): void {
  // Only run if there is a folder of `.github/workflows`, otherwise actionlint will fail
  if (!fs.existsSync('.github/workflows')) return

  if (canRunBinary('actionlint')) {
    const started = Date.now()
    execVoidCommandSync(`actionlint`)
    console.log(`${boldGrey('actionlint')} ${dimGrey(`took ` + _since(started))}`)
  } else {
    console.log(
      `actionlint is not installed and won't be run.\nThis is how to install it: https://github.com/rhysd/actionlint/blob/main/docs/install.md`,
    )
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

function gitStatus(): string | undefined {
  try {
    return execSync('git status', {
      encoding: 'utf8',
    })
  } catch {}
}
