import * as fs from 'fs-extra'
import { buildCopyCommand } from './build-copy.command'
import { tscProdCommand } from './tsc-prod.command'

export async function buildProdCommand (): Promise<void> {
  await fs.emptyDir('./dist')

  await buildCopyCommand()
  await tscProdCommand()
}
