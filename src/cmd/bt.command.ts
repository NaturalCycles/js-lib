import * as fs from 'fs-extra'
import { tsc } from '../util/tsc.util'
import { testCommand } from './test.command'
import { tscScriptsCommand } from './tsc-scripts.command'

export async function btCommand(): Promise<void> {
  await fs.emptyDir('./dist')

  await tsc()
  await tscScriptsCommand()
  await testCommand()
}
