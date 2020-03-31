import { execCommand } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs-extra'

// You cannot have a shared `tsconfig.prod.json` because of relative paths for `include`
const TSCONF_CJS_PATH = `./tsconfig.cjs.prod.json`
const TSCONF_ESM_PATH = `./tsconfig.esm.prod.json`
const TSCONF_PATH = `./tsconfig.prod.json`

export async function buildProdESMCJSCommand(): Promise<void> {
  const [cjsExists, esmExists] = await Promise.all([
    fs.pathExists(TSCONF_CJS_PATH),
    fs.pathExists(TSCONF_ESM_PATH),
    fs.emptyDir('./dist'),
    fs.emptyDir('./dist-esm'),
  ])

  const cjsPath = cjsExists ? TSCONF_CJS_PATH : TSCONF_PATH
  const esmPath = esmExists ? TSCONF_ESM_PATH : TSCONF_PATH

  await Promise.all([
    execCommand(`tsc -P ${cjsPath} --outDir ./dist --module commonjs`),
    execCommand(`tsc -P ${esmPath} --outDir ./dist-esm --module esnext --declaration false`),
  ])
}
