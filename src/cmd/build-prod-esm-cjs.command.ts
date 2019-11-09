import { execCommand } from '@naturalcycles/nodejs-lib'
import * as fs from 'fs-extra'

export async function buildProdESMCJSCommand(): Promise<void> {
  await Promise.all([fs.emptyDir('./dist'), fs.emptyDir('./dist-esm')])

  // You cannot have a shared `tsconfig.prod.json` because of relative paths for `include`
  const projectTsconfigPath = `./tsconfig.prod.json`

  await Promise.all([
    execCommand(`tsc -P ${projectTsconfigPath} --outDir ./dist --module commonjs`),
    execCommand(
      `tsc -P ${projectTsconfigPath} --outDir ./dist-esm --module esnext --declaration false`,
    ),
  ])
}
