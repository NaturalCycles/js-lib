import * as fs from 'fs-extra'
import { tsc } from '../util/tsc.util'
import { tscScriptsCommand } from './tsc-scripts.command'

export async function buildCommand (): Promise<void> {
  await fs.emptyDir('./dist')

  await tsc()
  await tscScriptsCommand()
}
