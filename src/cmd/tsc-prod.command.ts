import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'

export async function tscProdCommand(): Promise<void> {
  // You cannot have a shared `tsconfig.prod.json` because of relative paths for `include`
  const projectTsconfigPath = `./tsconfig.prod.json`

  const args: string[] = ['-P', projectTsconfigPath]

  await execWithArgs(`tsc`, args)
}
