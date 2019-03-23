import * as c from 'ansi-colors'
import { execCommand } from '../util/exec.util'
const commandExistsSync = require('command-exists').sync

export async function lintCircleCICommand (): Promise<void> {
  if (!commandExistsSync('circleci')) {
    // Cannot validate, cause `circleci` binary is not installed
    console.log(
      `!!\n!! Please install ${c.bold.grey('circleci')} CLI to validate ${c.bold.grey(
        'config.yml',
      )}\n!!\n!! https://circleci.com/docs/2.0/local-cli\n!!`,
    )
    return
  }

  await execCommand('circleci', ['config', 'validate'])
}
