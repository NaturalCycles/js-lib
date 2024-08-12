#!/usr/bin/env node

import os from 'node:os'
import { select, Separator } from '@inquirer/prompts'
import { _assert, _by, PromisableFunction } from '@naturalcycles/js-lib'
import { dimGrey, runScript } from '@naturalcycles/nodejs-lib'
import { buildCopy, buildEsmCjs, buildProd, runTSCInFolders } from '../build.util'
import {
  eslintAll,
  lintAllCommand,
  lintStagedCommand,
  runBiome,
  runCommitlintCommand,
  runPrettier,
  stylelintAll,
} from '../lint.util'
import { runJest } from '../test.util'
import { up, upnc } from '../yarn.util'

interface Command {
  name: string
  desc?: string
  fn: PromisableFunction
  cliOnly?: boolean
  interactiveOnly?: boolean
}

const commands: (Command | Separator)[] = [
  new Separator(), // build
  {
    name: 'build',
    fn: buildProd,
    desc: 'Clean ./dist, run "build-copy" then tsc with emit, using tsconfig.prod.json',
    cliOnly: true,
  },
  {
    name: 'build-copy',
    fn: buildCopy,
    desc: 'Copy the non-ts files from ./src to ./dist',
    cliOnly: true,
  },
  {
    name: 'build-esm-cjs',
    fn: buildEsmCjs,
    desc: 'Clean ./dist and ./dist-esm, then run "tsc" in CJS and ESM modes.',
    cliOnly: true,
  },
  {
    name: 'tsc',
    fn: tscAll,
    desc: 'Run tsc in folders (src, scripts, e2e, playwright) if there is tsconfig.json present',
  },
  { name: 'bt', fn: bt, desc: 'Build & Test: run "build" and then "test".' },
  { name: 'lbt', fn: lbt, desc: 'Lint/Build/Test: run "lint", then "build", then "test".' },
  new Separator(), // test
  { name: 'test', fn: runJest, desc: 'Run jest for *.test.ts files.' },
  {
    name: 'test-integration',
    fn: () => runJest({ integration: true }),
    desc: 'Run jest for *.integration.test.ts files.',
  },
  {
    name: 'test-leaks',
    fn: () => runJest({ leaks: true }),
    desc: 'Run jest --detectLeaks for *.test.ts files.',
  },
  new Separator(), // lint
  {
    name: 'lint',
    fn: lintAllCommand,
    desc: 'Run all linters: eslint, prettier, stylelint, ktlint, actionlint.',
  },
  {
    name: 'lint-staged',
    fn: lintStagedCommand,
    desc: 'Run "lint-staged", which runs linter on git staged files.',
  },
  { name: 'eslint', fn: eslintAll, desc: 'Run eslint on all files.' },
  {
    name: 'eslint --no-fix',
    fn: async () => await eslintAll({ fix: false }),
    desc: 'Run eslint on all files with "auto-fix" disabled. Useful for debugging.',
    interactiveOnly: true,
  },
  {
    name: 'biome',
    fn: () => runBiome(),
    desc: 'Run biome linter on all files.',
  },
  {
    name: 'biome --no-fix',
    fn: () => runBiome(false),
    desc: 'Run biome linter on all files with "auto-fix" disabled. Useful for debugging.',
    interactiveOnly: true,
  },
  { name: 'prettier', fn: runPrettier, desc: 'Run prettier on all files.' },
  { name: 'stylelint', fn: stylelintAll, desc: 'Run stylelint on all files.' },
  { name: 'commitlint', fn: runCommitlintCommand, desc: 'Run commitlint.', cliOnly: true },
  new Separator(), // yarn
  { name: 'up', fn: up, desc: 'Shortcut for "yarn upgrade". Also runs yarn-deduplicate.' },
  {
    name: 'upnc',
    fn: upnc,
    desc: 'Shortcut for "yarn upgrade --pattern @naturalcycles". Also runs yarn-deduplicate.',
  },
  new Separator(), // interactive-only
  {
    name: 'exit',
    fn: () => console.log('see you!'),
    desc: 'Do nothing and exit.',
    interactiveOnly: true,
  },
  // currently disabled
  // build-copy is excluded
  // init: initFromDevLibCommand, // todo: reimplement!
  // 'update-from-dev-lib': () => {
  //   // todo: reimplement, name it `sync` maybe?
  //   kpySync({
  //     baseDir: cfgOverwriteDir,
  //     outputDir: './',
  //     dotfiles: true,
  //     verbose: true,
  //   })
  // },
]

const commandMap = _by(commands.filter(c => !(c instanceof Separator)) as Command[], c => c.name)

const { CI } = process.env

runScript(async () => {
  logEnvironment()

  let cmd = process.argv.find(s => commandMap[s] && !commandMap[s].interactiveOnly)

  if (!cmd) {
    // interactive mode
    _assert(!CI, 'interactive dev-lib should not be run in CI')

    cmd = await select({
      message: 'Select command',
      pageSize: 30,
      choices: commands
        .filter(c => c instanceof Separator || !c.cliOnly)
        .map(c => {
          if (c instanceof Separator) return c
          return {
            value: c.name,
            description: c.desc,
          }
        }),
    })
  }

  await commandMap[cmd]!.fn()
})

async function lbt(): Promise<void> {
  await lintAllCommand()
  await bt()
}

async function bt(): Promise<void> {
  await tscAll()
  runJest()
}

async function tscAll(): Promise<void> {
  // todo: remove playwright after it fully moves to e2e
  await runTSCInFolders(['.', 'scripts', 'e2e', 'playwright'], ['--noEmit'])
}

function logEnvironment(): void {
  const { CPU_LIMIT, NODE_OPTIONS = 'not defined' } = process.env
  const { node } = process.versions
  const cpuLimit = Number(CPU_LIMIT) || undefined
  const availableParallelism = os.availableParallelism?.()
  const cpus = os.cpus().length
  console.log(
    dimGrey(
      Object.entries({
        node,
        NODE_OPTIONS,
        cpus,
        availableParallelism,
        cpuLimit,
      })
        .map(([k, v]) => `${k}: ${v}`)
        .join(', '),
    ),
  )
}
