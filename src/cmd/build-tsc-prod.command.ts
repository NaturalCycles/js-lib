import { execCommand } from '../util/exec.util'

export async function buildTscProdCommand (): Promise<void> {
  await execCommand(`tsc`, [`-p`, `tsconfig.prod.json`])
}
