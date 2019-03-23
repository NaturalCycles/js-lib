import * as fs from 'fs-extra'
import { buildTscCommand } from './build-tsc.command'
import { testCommand } from './test.command'

export async function btCommand (): Promise<void> {
  await fs.emptyDir('./dist')

  // `test` needs full path, cause, I guess, it conflicts with native OS `test` command?..
  // void execCommand(`tsc && yarn test`)
  // NO, the only need was to override test to use FULL_ICU (which is fixed now)
  await buildTscCommand()
  await testCommand()
}
