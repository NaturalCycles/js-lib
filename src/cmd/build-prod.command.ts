import { _emptyDirSync } from '@naturalcycles/nodejs-lib'
import { buildCopyCommand } from './build-copy.command'
import { tscProdCommand } from './tsc-prod.command'

export async function buildProdCommand(): Promise<void> {
  _emptyDirSync('./dist') // it doesn't delete the dir itself, to prevent IDE jumping
  // fs.rmSync('./dist', { recursive: true, force: true })
  buildCopyCommand()
  await tscProdCommand()
}
