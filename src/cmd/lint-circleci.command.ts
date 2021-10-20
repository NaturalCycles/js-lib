import { boldGrey } from '@naturalcycles/nodejs-lib/dist/colors'
import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'

export async function lintCircleCICommand(): Promise<void> {
  const commandExistsSync = require('command-exists').sync

  if (!commandExistsSync('circleci')) {
    // Cannot validate, cause `circleci` binary is not installed
    console.warn(
      `!!\n!! Please install ${boldGrey('circleci')} CLI to validate ${boldGrey(
        'config.yml',
      )}\n!!\n!! https://circleci.com/docs/2.0/local-cli/\n!!`,
    )

    return process.exit(5)
  }

  await execWithArgs('circleci', ['config', 'validate'])
}
