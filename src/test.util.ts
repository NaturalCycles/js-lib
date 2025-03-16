import fs from 'node:fs'
import { _range, _uniq } from '@naturalcycles/js-lib'
import { dimGrey, exec2 } from '@naturalcycles/nodejs-lib'
import { cfgDir } from './paths'

interface RunTestOptions {
  integration?: boolean
  manual?: boolean
  leaks?: boolean
}

export function runTest(opt: RunTestOptions = {}): void {
  if (nodeModuleExists('vitest')) {
    runVitest(opt)
    return
  }

  if (nodeModuleExists('jest')) {
    runJest(opt)
    return
  }

  console.log(dimGrey(`vitest/jest not found, skipping tests`))
}

function runVitest(opt: RunTestOptions): void {
  const { integration, manual } = opt
  const processArgs = process.argv.slice(3)
  const args: string[] = [...processArgs]
  const { TZ = 'UTC', APP_ENV } = process.env
  const env = {
    TZ,
  }
  if (!integration && !manual && !APP_ENV) {
    Object.assign(env, {
      APP_ENV: 'test',
    })
  }

  exec2.spawn('vitest', {
    args: _uniq(args),
    logFinish: false,
    shell: false,
    env,
  })
}

/**
 * 1. Adds `--silent` if running all tests at once.
 */
function runJest(opt: RunTestOptions): void {
  const { CI, CPU_LIMIT, TZ = 'UTC', APP_ENV, JEST_NO_ALPHABETIC, JEST_SHARDS } = process.env
  const cpuLimit = Number(CPU_LIMIT) || undefined
  const { integration, manual, leaks } = opt
  const processArgs = process.argv.slice(3)

  let jestConfig: string | undefined

  if (manual) {
    jestConfig = getJestManualConfigPath()
  } else if (integration) {
    jestConfig = getJestIntegrationConfigPath()
  } else {
    jestConfig = getJestConfigPath()
  }

  if (!jestConfig) {
    console.log(dimGrey(`./jest.config.js not found, skipping jest`))
    return
  }

  // Allow to override --maxWorkers
  let maxWorkers = processArgs.find(a => a.startsWith('--maxWorkers'))

  const args: string[] = [
    `--config=${jestConfig}`,
    '--logHeapUsage',
    '--passWithNoTests',
    ...processArgs,
  ]

  const env = {
    TZ,
    DEBUG_COLORS: '1',
  }

  if (CI) {
    args.push('--ci')

    // Works with both --coverage=false and --no-coverage syntaxes
    if (!integration && !manual && !processArgs.some(a => a.includes('-coverage'))) {
      // Coverage only makes sense for unit tests, not for integration/manual
      args.push('--coverage')
    }

    if (!maxWorkers && cpuLimit && cpuLimit > 1) {
      maxWorkers = `--maxWorkers=${cpuLimit - 1}`
    }
  }

  // Running all tests - will use `--silent` to suppress console-logs, will also set process.env.JEST_SILENT=1
  if (CI || isRunningAllTests()) {
    args.push('--silent')
  }

  if (leaks) {
    args.push('--detectOpenHandles', '--detectLeaks')
    maxWorkers ||= '--maxWorkers=1'
  }

  if (maxWorkers) args.push(maxWorkers)

  if (args.includes('--silent')) {
    Object.assign(env, {
      JEST_SILENT: '1',
    })
  }

  if (!integration && !manual && !APP_ENV) {
    Object.assign(env, {
      APP_ENV: 'test',
    })
  }

  if (!JEST_NO_ALPHABETIC) {
    args.push(`--testSequencer=${cfgDir}/jest.alphabetic.sequencer.js`)
  }

  if (JEST_SHARDS) {
    const totalShards = Number(JEST_SHARDS)
    const shards = _range(1, totalShards + 1)

    for (const shard of shards) {
      exec2.spawn('jest', {
        args: _uniq([...args, `--shard=${shard}/${totalShards}`]),
        logFinish: false,
        shell: false,
        env,
      })
    }
  } else {
    exec2.spawn('jest', {
      args: _uniq(args),
      logFinish: false,
      shell: false,
      env,
    })
  }
}

/**
 * Returns true if module with given name exists in _target project's_ node_modules.
 */
function nodeModuleExists(moduleName: string): boolean {
  return fs.existsSync(`./node_modules/${moduleName}`)
}

function getJestConfigPath(): string | undefined {
  return fs.existsSync(`./jest.config.js`) ? './jest.config.js' : undefined
}

function getJestIntegrationConfigPath(): string {
  return fs.existsSync(`./jest.integration-test.config.js`)
    ? `./jest.integration-test.config.js`
    : `${cfgDir}/jest.integration-test.config.js`
}

function getJestManualConfigPath(): string {
  return fs.existsSync(`./jest.manual-test.config.js`)
    ? `./jest.manual-test.config.js`
    : `${cfgDir}/jest.manual-test.config.js`
}

/**
 * Detects if jest is run with all tests, or with specific tests.
 */
function isRunningAllTests(): boolean {
  const args = process.argv.slice(3)
  const positionalArgs = args.filter(a => !a.startsWith('-'))

  // console.log(process.argv, positionalArgs)

  return !positionalArgs.length
}
