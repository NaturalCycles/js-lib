import { execCommand } from '../util/exec.util'

export async function buildTscCommand (): Promise<void> {
  // You cannot have a shared `tsconfig.json` because of relative paths for `include`
  await execCommand(`tsc`)
}
