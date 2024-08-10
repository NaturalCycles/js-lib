import cp, { type ExecSyncOptions } from 'node:child_process'
import fs from 'node:fs'
import { _isTruthy, _since, _truncate } from '@naturalcycles/js-lib'
import {
  boldGrey,
  commitMessageToTitleMessage,
  dimGrey,
  execVoidCommand,
  execVoidCommandSync,
  getLastGitCommitMsg,
  gitCommitAll,
  gitCurrentBranchName,
  gitPull,
  gitPush,
} from '@naturalcycles/nodejs-lib'
import yargs from 'yargs'
import { cfgDir, scriptsDir } from './paths'
const {
  prettierDirs,
  prettierExtensionsAll,
  stylelintExtensions,
  lintExclude,
} = require('../cfg/_cnst')

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

  const needToTrackChanges = commitOnChanges || failOnChanges
  const gitStatusAtStart = gitStatus()
  if (needToTrackChanges && gitStatusAtStart) {
    console.log('lint-all: git shows changes before run:')
    console.log(gitStatusAtStart)
  }

  // Fast linters (that run in <1 second) go first

  runActionLint()

  runBiome()

  // From this point we start the "slow" linters, with ESLint leading the way

  // We run eslint BEFORE Prettier, because eslint can delete e.g unused imports.
  await eslintAll()

  if (
    fs.existsSync(`node_modules/stylelint`) &&
    fs.existsSync(`node_modules/stylelint-config-standard-scss`)
  ) {
    stylelintAll()
  }

  runPrettier()

  await runKTLint()

  console.log(`${boldGrey('lint-all')} ${dimGrey(`took ` + _since(started))}`)

  if (needToTrackChanges) {
    const gitStatusAfter = gitStatus()
    const hasChanges = gitStatusAfter !== gitStatusAtStart
    if (!hasChanges) return
    const msg = 'style(ci): ' + _truncate(commitMessageToTitleMessage(getLastGitCommitMsg()), 60)

    // pull, commit, push changes
    gitPull()
    gitCommitAll(msg)
    gitPush()

    // fail on changes
    if (failOnChanges) {
      console.log(gitStatusAfter)
      console.log('lint-all failOnChanges: exiting with status 1')
      process.exitCode = 1
    }
  }
}

interface EslintAllOptions {
  ext?: string
  fix?: boolean
}

/**
 * Runs `eslint` command for all predefined paths (e.g /src, /scripts, etc).
 */
export async function eslintAll(opt?: EslintAllOptions): Promise<void> {
  const started = Date.now()
  const { argv } = yargs.options({
    ext: {
      type: 'string',
      default: 'ts,tsx,vue',
    },
    fix: {
      type: 'boolean',
      default: true,
    },
  })

  const { ext, fix } = {
    ...argv,
    ...opt,
  }

  const extensions = ext.split(',')

  const eslintConfigPathRoot = ['./eslint.config.js'].find(p => fs.existsSync(p))
  const eslintConfigPathScripts = ['./scripts/eslint.config.js', './eslint.config.js'].find(p =>
    fs.existsSync(p),
  )
  const eslintConfigPathE2e = ['./e2e/eslint.config.js', './eslint.config.js'].find(p =>
    fs.existsSync(p),
  )
  const eslintConfigPathPlaywright = ['./playwright/eslint.config.js', './eslint.config.js'].find(
    p => fs.existsSync(p),
  )

  const tsconfigPathScripts =
    [`./scripts/tsconfig.json`].find(p => fs.existsSync(p)) || `${scriptsDir}/tsconfig.json`
  const tsconfigPathE2e = `./e2e/tsconfig.json`
  const tsconfigPathPlaywright = `./playwright/tsconfig.json`

  // todo: run on other dirs too, e.g pages, components, layouts

  if (fix) {
    await Promise.all([
      // /src
      runESLint(`./src`, eslintConfigPathRoot, undefined, extensions, fix),
      // /scripts
      runESLint(`./scripts`, eslintConfigPathScripts, tsconfigPathScripts, undefined, fix),
      // /e2e
      runESLint(`./e2e`, eslintConfigPathE2e, tsconfigPathE2e, undefined, fix),
      // /playwright // todo: remove after migration to e2e folder is completed
      runESLint(`./playwright`, eslintConfigPathPlaywright, tsconfigPathPlaywright, undefined, fix),
    ])
  } else {
    // with no-fix - let's run serially
    // /src
    await runESLint(`./src`, eslintConfigPathRoot, undefined, extensions, fix)
    // /scripts
    await runESLint(`./scripts`, eslintConfigPathScripts, tsconfigPathScripts, undefined, fix)
    // /e2e
    await runESLint(`./e2e`, eslintConfigPathE2e, tsconfigPathE2e, undefined, fix)
    // /e2e
    await runESLint(
      `./playwright`,
      eslintConfigPathPlaywright,
      tsconfigPathPlaywright,
      undefined,
      fix,
    )
  }

  console.log(`${boldGrey('eslint-all')} ${dimGrey(`took ` + _since(started))}`)
}

async function runESLint(
  dir: string,
  eslintConfigPath: string | undefined,
  tsconfigPath?: string,
  extensions = ['ts', 'tsx', 'vue'],
  fix = true,
): Promise<void> {
  if (!eslintConfigPath || !fs.existsSync(dir)) return // faster to bail-out like this

  await execVoidCommand(
    'eslint',
    [
      `--config`,
      eslintConfigPath,
      `${dir}/**/*.{${extensions.join(',')}}`,
      ...(tsconfigPath ? [`--parser-options=project:${tsconfigPath}`] : []),
      `--no-error-on-unmatched-pattern`,
      `--report-unused-disable-directives`, // todo: unnecessary with flat, as it's defined in the config
      fix ? `--fix` : '',
    ].filter(Boolean),
  )
}

const prettierPaths = [
  // Everything inside these folders
  `./{${prettierDirs}}/**/*.{${prettierExtensionsAll}}`,

  // Root
  `./*.{${prettierExtensionsAll}}`,

  // Exclude
  ...lintExclude.map((s: string) => `!${s}`),
]

export function runPrettier(): void {
  const prettierConfigPath = [`./prettier.config.js`].find(f => fs.existsSync(f))
  if (!prettierConfigPath) return

  // prettier --write 'src/**/*.{js,ts,css,scss,graphql}'
  execVoidCommandSync('prettier', [
    `--write`,
    `--log-level=warn`,
    `--config`,
    prettierConfigPath,
    ...prettierPaths,
  ])
}

const stylelintPaths = [
  // Everything inside these folders
  `./{${prettierDirs}}/**/*.{${stylelintExtensions}}`,

  // Exclude
  ...lintExclude.map((s: string) => `!${s}`),
]

export function stylelintAll(): void {
  const { fix } = yargs.options({
    fix: {
      type: 'boolean',
      default: true,
    },
  }).argv

  const config = [`./stylelint.config.js`].find(f => fs.existsSync(f))
  if (!config) return

  execVoidCommandSync(
    'stylelint',
    [fix ? `--fix` : '', `--allow-empty-input`, `--config`, config, ...stylelintPaths].filter(
      Boolean,
    ),
  )
}

export async function lintStagedCommand(): Promise<void> {
  // const cwd = process.cwd()
  const localConfig = `./lint-staged.config.js`
  const sharedConfig = `${cfgDir}/lint-staged.config.js`
  const config = fs.existsSync(localConfig) ? localConfig : sharedConfig
  // if (!config) {
  //   console.log(`lint-staged is skipped, because no ${localConfig} is found`)
  //   return
  // }

  // await execWithArgs(`lint-staged`, [`--config`, config])
  // const lintStaged = require('lint-staged')
  // lint-staged is ESM since 12.0
  // const lintStaged = await import('lint-staged')
  /* eslint-disable no-eval */
  // biome-ignore lint/security/noGlobalEval: ok
  const { default: lintStaged } = await eval(`import('lint-staged')`)
  const success = await lintStaged({
    configPath: config,
  })

  if (!success) process.exit(3)
}

export function runCommitlintCommand(): void {
  const editMsg = process.argv.at(-1) || '.git/COMMIT_EDITMSG'
  // console.log(editMsg)

  const cwd = process.cwd()
  const localConfig = `${cwd}/commitlint.config.js`
  const sharedConfig = `${cfgDir}/commitlint.config.js`
  const config = fs.existsSync(localConfig) ? localConfig : sharedConfig

  const env = {
    ...process.env, // important to pass it through, to preserve $PATH
    GIT_BRANCH: gitCurrentBranchName(),
  }

  // await execWithArgs(`commitlint`, [`--edit`, editMsg, `--config`, config], { env })
  execSync(`node ./node_modules/.bin/commitlint --edit ${editMsg} --config ${config}`, {
    env,
  })
}

async function runKTLint(): Promise<void> {
  if (!fs.existsSync(`node_modules/@naturalcycles/ktlint`)) return
  const ktlintLib = require('@naturalcycles/ktlint')
  await ktlintLib.ktlintAll()
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

export function runBiome(verbose = false, fix = true): void {
  if (!fs.existsSync(`node_modules/@biomejs/biome`)) {
    if (verbose) {
      console.log(`biome is not installed (checked in node_modules/@biomejs/biome), skipping`)
    }
    return
  }

  const configPath = `biome.jsonc`
  if (!fs.existsSync(configPath)) {
    if (verbose) console.log(`biome is installed, but biome.jsonc config file is missing`)
    return
  }

  const dirs = [`src`, `scripts`, `e2e`, `playwright`].filter(d => fs.existsSync(d))

  execVoidCommandSync(
    `biome`,
    [`lint`, fix && '--write', fix && '--unsafe', ...dirs].filter(_isTruthy),
  )
}

function canRunBinary(name: string): boolean {
  try {
    cp.execSync(`which ${name}`)
    return true
  } catch {
    return false
  }
}

function gitStatus(): string | undefined {
  try {
    return cp.execSync('git status -s', {
      encoding: 'utf8',
    })
  } catch {}
}

function execSync(cmd: string, opt?: ExecSyncOptions): void {
  try {
    cp.execSync(cmd, {
      ...opt,
      encoding: 'utf8',
      stdio: 'inherit',
    })
  } catch {
    process.exit(1)
  }
}
