import * as fs from 'fs-extra'
import { cfgDir } from '../cnst/paths.cnst'
import { proxyCommand } from './exec.util'
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

/**
 * 1. Detects `full-icu` support, sets NODE_ICU_DATA if needed.
 * 2. Adds `--silent` if running all tests at once.
 */
export async function runJest (ci = false, integration = false): Promise<void> {
  const fullICUPath = getFullICUPathIfExists()
  const jestConfig = integration ? getJestIntegrationConfigPath() : getJestConfigPath()

  const args: string[] = []
  const env = {}

  if (ci) {
    args.push('--ci', '--coverage', '--maxWorkers=2')
  }

  // Running all tests - will use `--silent` to suppress console-logs, will also set process.env.JEST_SILENT=1
  if (ci || isRunningAllTests()) {
    Object.assign(env, {
      JEST_SILENT: '1',
    })

    args.push('--silent')
  }

  if (fullICUPath) {
    Object.assign(env, {
      NODE_ICU_DATA: fullICUPath,
    })
  }

  if (jestConfig) {
    args.push(`--config=${jestConfig}`)
  }

  await proxyCommand('jest', args, {
    env,
  })
}
