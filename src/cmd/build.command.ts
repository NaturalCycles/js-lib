import * as fs from 'fs-extra'
import { buildTscScriptsCommand } from './build-tsc-scripts.command'
import { buildTscCommand } from './build-tsc.command'

export async function buildCommand (): Promise<void> {
  await fs.emptyDir('./dist')

  await buildTscCommand()
  await buildTscScriptsCommand()
}
