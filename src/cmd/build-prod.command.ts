import * as fs from 'fs'
import { buildCopyCommand } from './build-copy.command'
import { tscProdCommand } from './tsc-prod.command'

export async function buildProdCommand(): Promise<void> {
  fs.rmSync('./dist', { recursive: true, force: true })
  buildCopyCommand()
  await tscProdCommand()
}
