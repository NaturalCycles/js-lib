import * as fs from 'fs-extra'
import { buildTscCommand } from './build-tsc.command'

export async function buildCommand (): Promise<void> {
  await fs.emptyDir('./dist')

  await buildTscCommand()
}
