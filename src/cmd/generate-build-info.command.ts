import * as fs from 'fs-extra'
import * as path from 'path'
import * as yargs from 'yargs'
import { generateBuildInfo, objectToShellExport } from '..'

export async function generateBuildInfoCommand (): Promise<void> {
  const { dir, shell } = yargs.options({
    dir: {
      type: 'string',
      desc: 'Output directory',
    },
    shell: {
      type: 'boolean',
      desc: 'Generate buildInfo.sh as well',
      default: false,
    },
  }).argv

  const buildInfo = await generateBuildInfo()
  console.log(buildInfo)

  if (dir) await fs.ensureDir(dir)

  const buildInfoPath = dir ? path.resolve(dir, 'buildInfo.json') : 'buildInfo.json'
  await fs.writeJson(buildInfoPath, buildInfo, { spaces: 2 })

  if (shell) {
    const buildInfoShell = objectToShellExport(buildInfo, 'buildInfo_')
    const buildInfoShellPath = dir ? path.resolve(dir, 'buildInfo.sh') : 'buildInfo.sh'
    await fs.writeFile(buildInfoShellPath, buildInfoShell)
  }
}
