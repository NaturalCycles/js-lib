import { execCommand } from '../util/exec.util'

export async function buildTscProdCommand (): Promise<void> {
  // You cannot have a shared `tsconfig.prod.json` because of relative paths for `include`
  const projectTsconfigPath = `./tsconfig.prod.json`

  const args: string[] = ['-P', projectTsconfigPath]

  await execCommand(`tsc`, args)
}
