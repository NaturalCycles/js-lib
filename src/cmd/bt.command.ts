import * as fs from 'fs-extra'
import { buildTscScriptsCommand } from './build-tsc-scripts.command'
import { buildTscCommand } from './build-tsc.command'
import { testCommand } from './test.command'

export async function btCommand (): Promise<void> {
  await fs.emptyDir('./dist')

  await buildTscCommand()
  await buildTscScriptsCommand()
  await testCommand()
}
