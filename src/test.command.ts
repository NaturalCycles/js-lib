import { proxyCommand } from './util/exec.util'
import { getFullICUPathIfExists, getJestConfig, isRunningAllTests } from './util/test.util'

/**
 * 1. Detects `full-icu` support, sets NODE_ICU_DATA if needed.
 * 2. Adds `--silent` if running all tests at once.
 */
export async function testCommand (): Promise<void> {
  const fullICUPath = getFullICUPathIfExists()
  const jestConfig = getJestConfig()

  const args: string[] = []

  const env = {}

  // Running all tests - will use `--silent` to suppress console-logs, will also set process.env.JEST_SILENT=1
  if (isRunningAllTests()) {
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
    args.push(jestConfig)
  }

  await proxyCommand('./node_modules/.bin/jest', args, {
    env,
  })
}
