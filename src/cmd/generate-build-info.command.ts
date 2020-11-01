import * as fs from 'fs-extra'
import * as path from 'path'
import * as yargs from 'yargs'
import { generateBuildInfo } from '..'

export async function generateBuildInfoCommand(): Promise<void> {
  const { dir } = yargs.options({
    dir: {
      type: 'string',
      desc: 'Output directory',
    },
  }).argv

  const buildInfo = await generateBuildInfo()
  console.log(buildInfo)

  if (dir) fs.ensureDirSync(dir)

  const buildInfoPath = dir ? path.resolve(dir, 'buildInfo.json') : 'buildInfo.json'
  fs.writeJsonSync(buildInfoPath, buildInfo, { spaces: 2 })
}
