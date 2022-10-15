import * as fs from 'node:fs'
import * as path from 'node:path'
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

  if (dir) fs.mkdirSync(dir, { recursive: true })

  const buildInfoPath = dir ? path.resolve(dir, 'buildInfo.json') : 'buildInfo.json'
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2))
}
