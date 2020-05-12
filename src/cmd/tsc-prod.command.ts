import { _since } from '@naturalcycles/js-lib'
import { boldGrey, dimGrey } from '@naturalcycles/nodejs-lib/dist/colors'
import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'

export async function tscProdCommand(): Promise<void> {
  // You cannot have a shared `tsconfig.prod.json` because of relative paths for `include`
  const projectTsconfigPath = `./tsconfig.prod.json`

  const args: string[] = ['-P', projectTsconfigPath]

  const started = Date.now()
  await execWithArgs(`tsc`, args)
  console.log(`${boldGrey('tsc prod')} ${dimGrey(`took ` + _since(started))}`)
}
