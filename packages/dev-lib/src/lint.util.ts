import { execSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import type { SemVerString, UnixTimestampMillis } from '@naturalcycles/js-lib'
import { _assert, _isTruthy, _since, _truncate, semver2 } from '@naturalcycles/js-lib'
import { _yargs, boldGrey, dimGrey, exec2, git2 } from '@naturalcycles/nodejs-lib'
import {
  eslintExtensions,
  lintExclude,
  minActionlintVersion,
  prettierDirs,
  prettierExtensionsAll,
  stylelintExtensions,
} from '../cfg/_cnst.js'
import { cfgDir, scriptsDir } from './paths.js'

/**
 * Run all linters.
 */
export async function lintAllCommand(): Promise<void> {
  const started = Date.now() as UnixTimestampMillis
  const { commitOnChanges, failOnChanges } = _yargs().options({
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
    existsSync(`node_modules/stylelint`) &&
    existsSync(`node_modules/stylelint-config-standard-scss`)
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
    const msg =
      'style(ci): ' + _truncate(git2.commitMessageToTitleMessage(git2.getLastGitCommitMsg()), 60)

    // pull, commit, push changes
    git2.pull()
    git2.commitAll(msg)
    git2.push()

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
  const started = Date.now() as UnixTimestampMillis
  const { argv } = _yargs().options({
    ext: {
      type: 'string',
      default: eslintExtensions,
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

  const eslintConfigPathRoot = ['./eslint.config.js'].find(p => existsSync(p))
  const eslintConfigPathScripts = ['./scripts/eslint.config.js', './eslint.config.js'].find(p =>
    existsSync(p),
  )
  const eslintConfigPathE2e = ['./e2e/eslint.config.js', './eslint.config.js'].find(p =>
    existsSync(p),
  )

  const tsconfigPathScripts =
    [`./scripts/tsconfig.json`].find(p => existsSync(p)) || `${scriptsDir}/tsconfig.json`
  const tsconfigPathE2e = `./e2e/tsconfig.json`

  // todo: run on other dirs too, e.g pages, components, layouts

  if (fix) {
    await Promise.all([
      // /src
      runESLint(`./src`, eslintConfigPathRoot, undefined, extensions, fix),
      // /scripts
      runESLint(`./scripts`, eslintConfigPathScripts, tsconfigPathScripts, extensions, fix),
      // /e2e
      runESLint(`./e2e`, eslintConfigPathE2e, tsconfigPathE2e, extensions, fix),
    ])
  } else {
    // with no-fix - let's run serially
    // /src
    await runESLint(`./src`, eslintConfigPathRoot, undefined, extensions, fix)
    // /scripts
    await runESLint(`./scripts`, eslintConfigPathScripts, tsconfigPathScripts, extensions, fix)
    // /e2e
    await runESLint(`./e2e`, eslintConfigPathE2e, tsconfigPathE2e, extensions, fix)
  }

  console.log(`${boldGrey('eslint-all')} ${dimGrey(`took ` + _since(started))}`)
}

async function runESLint(
  dir: string,
  eslintConfigPath: string | undefined,
  tsconfigPath?: string,
  extensions = eslintExtensions.split(','),
  fix = true,
): Promise<void> {
  if (!eslintConfigPath || !existsSync(dir)) return // faster to bail-out like this

  await exec2.spawnAsync('eslint', {
    args: [
      `--config`,
      eslintConfigPath,
      `${dir}/**/*.{${extensions.join(',')}}`,
      ...(tsconfigPath ? [`--parser-options=project:${tsconfigPath}`] : []),
      `--no-error-on-unmatched-pattern`,
      `--report-unused-disable-directives`, // todo: unnecessary with flat, as it's defined in the config
      fix ? `--fix` : '',
    ].filter(Boolean),
    shell: false,
  })
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
  const prettierConfigPath = [`./prettier.config.js`].find(f => existsSync(f))
  if (!prettierConfigPath) return

  // prettier --write 'src/**/*.{js,ts,css,scss,graphql}'
  exec2.spawn('prettier', {
    args: [`--write`, `--log-level=warn`, `--config`, prettierConfigPath, ...prettierPaths],
    shell: false,
  })
}

const stylelintPaths = [
  // Everything inside these folders
  `./{${prettierDirs}}/**/*.{${stylelintExtensions}}`,

  // Exclude
  ...lintExclude.map((s: string) => `!${s}`),
]

export function stylelintAll(): void {
  const { fix } = _yargs().options({
    fix: {
      type: 'boolean',
      default: true,
    },
  }).argv

  const config = [`./stylelint.config.js`].find(f => existsSync(f))
  if (!config) return

  exec2.spawn('stylelint', {
    args: [fix ? `--fix` : '', `--allow-empty-input`, `--config`, config, ...stylelintPaths].filter(
      Boolean,
    ),
    shell: false,
  })
}

export async function lintStagedCommand(): Promise<void> {
  const localConfig = `./lint-staged.config.js`
  const sharedConfig = `${cfgDir}/lint-staged.config.js`
  const config = existsSync(localConfig) ? localConfig : sharedConfig

  const { default: lintStaged } = await import('lint-staged')
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
  const config = existsSync(localConfig) ? localConfig : sharedConfig

  const env = {
    GIT_BRANCH: git2.getCurrentBranchName(),
  }

  // await execWithArgs(`commitlint`, [`--edit`, editMsg, `--config`, config], { env })
  exec2.spawn(`node ./node_modules/.bin/commitlint --edit ${editMsg} --config ${config}`, {
    env,
    passProcessEnv: true, // important to pass it through, to preserve $PATH
    forceColor: false,
    log: false,
  })
}

async function runKTLint(): Promise<void> {
  if (!existsSync(`node_modules/@naturalcycles/ktlint`)) return
  // @ts-expect-error ktlint is not installed, but it's ok
  const { default: ktlintLib } = await import('@naturalcycles/ktlint')
  await ktlintLib.ktlintAll()
}

function runActionLint(): void {
  // Only run if there is a folder of `.github/workflows`, otherwise actionlint will fail
  if (!existsSync('.github/workflows')) return

  if (canRunBinary('actionlint')) {
    requireActionlintVersion()
    exec2.spawn(`actionlint`)
  } else {
    console.log(
      `actionlint is not installed and won't be run.\nThis is how to install it: https://github.com/rhysd/actionlint/blob/main/docs/install.md`,
    )
  }
}

export function requireActionlintVersion(): void {
  const version = getActionLintVersion()
  if (!version) {
    return
  }

  _assert(
    semver2(version).isSameOrAfter(minActionlintVersion),
    `actionlint needs to be updated. Min accepted version: ${minActionlintVersion}, local version: ${version}\nThis is how to install/update it: https://github.com/rhysd/actionlint/blob/main/docs/install.md`,
  )
}

export function getActionLintVersion(): SemVerString | undefined {
  if (!canRunBinary('actionlint')) return
  return exec2.exec('actionlint --version').split('\n')[0]
}

export function runBiome(fix = true): void {
  // if (!fs.existsSync(`node_modules/@biomejs/biome`)) {
  //   if (verbose) {
  //     console.log(`biome is not installed (checked in node_modules/@biomejs/biome), skipping`)
  //   }
  //   return
  // }

  const configPath = `biome.jsonc`
  if (!existsSync(configPath)) {
    console.log(`biome is skipped, because ./biome.jsonc is not present`)
    return
  }

  const dirs = [`src`, `scripts`, `e2e`].filter(d => existsSync(d))

  exec2.spawn(`biome`, {
    args: [`lint`, fix && '--write', fix && '--unsafe', '--no-errors-on-unmatched', ...dirs].filter(
      _isTruthy,
    ),
    logFinish: false,
    shell: false,
  })
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
    return execSync('git status -s', {
      encoding: 'utf8',
    })
  } catch {}
}
