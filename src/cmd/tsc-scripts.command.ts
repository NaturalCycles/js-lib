import { execCommand } from '../util/exec.util'
import { ensureProjectTsconfigScripts } from '../util/tsc.util'

export async function tscScriptsCommand (): Promise<void> {
  const projectTsconfigPath = await ensureProjectTsconfigScripts()

  const args: string[] = ['-P', projectTsconfigPath, '--noEmit']

  await execCommand(`tsc`, args)
}
