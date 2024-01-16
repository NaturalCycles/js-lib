import { fs2 } from '@naturalcycles/nodejs-lib'
import { buildCopyCommand } from './build-copy.command'
import { tscProdCommand } from './tsc-prod.command'

export function buildProdCommand(): void {
  fs2.emptyDir('./dist') // it doesn't delete the dir itself, to prevent IDE jumping
  // fs.rmSync('./dist', { recursive: true, force: true })
  buildCopyCommand()
  tscProdCommand()
}
