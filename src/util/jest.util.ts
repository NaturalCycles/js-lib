import { dedupeArray } from '@naturalcycles/js-lib'
import * as fs from 'fs-extra'
import { cfgDir } from '../cnst/paths.cnst'
import { execCommand } from './exec.util'
import { getFullICUPathIfExists } from './test.util'

export function getJestConfigPath (): string | undefined {
  return fs.pathExistsSync(`./jest.config.js`) ? undefined : `${cfgDir}/jest.config.js`
}

export function getJestIntegrationConfigPath (): string | undefined {
  return fs.pathExistsSync(`./jest.integration-test.config.js`)
    ? `./jest.integration-test.config.js`
    : `${cfgDir}/jest.integration-test.config.js`
}

/**
 * Detects if jest is run with all tests, or with specific tests.
 */
export function isRunningAllTests (): boolean {
  const [, , ...args] = process.argv
  const positionalArgs = args.filter(a => !a.startsWith('-'))

  // console.log(process.argv, positionalArgs)

  return !positionalArgs.length
}

interface RunJestOpt {
  ci?: boolean
  integration?: boolean
  leaks?: boolean
}

/**
 * 1. Detects `full-icu` support, sets NODE_ICU_DATA if needed.
 * 2. Adds `--silent` if running all tests at once.
 */
export async function runJest (opt: RunJestOpt = {}): Promise<void> {
  const { ci, integration, leaks } = opt
  const [, , ...processArgs] = process.argv

  // Allow to override --maxWorkers
  let maxWorkers = processArgs.find(a => a.startsWith('--maxWorkers'))

  const args: string[] = ['--logHeapUsage', ...processArgs]
  const env = {
    TZ: process.env.TZ || 'UTC',
  }

  const jestConfig = integration ? getJestIntegrationConfigPath() : getJestConfigPath()
  if (jestConfig) {
    args.push(`--config=${jestConfig}`)
  }

  if (ci) {
    args.push('--ci', '--coverage')
    maxWorkers = maxWorkers || '--maxWorkers=2'
  }

  // Running all tests - will use `--silent` to suppress console-logs, will also set process.env.JEST_SILENT=1
  if (ci || isRunningAllTests()) {
    args.push('--silent')
  }

  const fullICUPath = getFullICUPathIfExists()
  if (fullICUPath) {
    Object.assign(env, {
      NODE_ICU_DATA: fullICUPath,
    })
  }

  if (leaks) {
    args.push('--detectOpenHandles', '--detectLeaks')
    maxWorkers = maxWorkers || '--maxWorkers=1'
  }

  if (maxWorkers) args.push(maxWorkers)

  if (args.includes('--silent')) {
    Object.assign(env, {
      JEST_SILENT: '1',
    })
  }

  if (!opt.integration && !process.env.APP_ENV) {
    Object.assign(env, {
      APP_ENV: 'test',
    })
  }

  await execCommand('jest', dedupeArray(args), {
    env,
  })
}
