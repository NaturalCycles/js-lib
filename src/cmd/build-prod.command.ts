import * as fs from 'fs-extra'
import { buildCopyCommand } from './build-copy.command'
import { tscProdCommand } from './tsc-prod.command'

export async function buildProdCommand(): Promise<void> {
  fs.emptyDirSync('./dist') // it doesn't delete the dir itself, to prevent IDE jumping
  // fs.rmSync('./dist', { recursive: true, force: true })
  buildCopyCommand()
  await tscProdCommand()
}
