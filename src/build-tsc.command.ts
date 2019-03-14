import { execCommand } from './util/exec.util'

export async function buildTscCommand (): Promise<void> {
  await execCommand(`tsc`)
}
