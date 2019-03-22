import { proxyCommand } from './util/exec.util'
import { getFullICUPathIfExists, getJestConfig } from './util/test.util'

export async function testCICommand (): Promise<void> {
  const fullICUPath = getFullICUPathIfExists()
  const jestConfig = getJestConfig()

  const args = ['--ci', '--coverage', '--maxWorkers=7', '--silent']

  const env = {
    JEST_SILENT: '1',
  }

  if (fullICUPath) {
    Object.assign(env, {
      NODE_ICU_DATA: fullICUPath,
    })
  }

  if (jestConfig) {
    args.push(jestConfig)
  }

  await proxyCommand('jest', args, {
    env,
  })
}
