import { _emptyDirSync, _pathExistsSync } from '@naturalcycles/nodejs-lib'
import { execCommand } from '@naturalcycles/nodejs-lib/dist/exec'

// You cannot have a shared `tsconfig.prod.json` because of relative paths for `include`
const TSCONF_CJS_PATH = `./tsconfig.cjs.prod.json`
const TSCONF_ESM_PATH = `./tsconfig.esm.prod.json`
const TSCONF_PATH = `./tsconfig.prod.json`

export async function buildProdESMCJSCommand(): Promise<void> {
  const [cjsExists, esmExists] = [
    _pathExistsSync(TSCONF_CJS_PATH),
    _pathExistsSync(TSCONF_ESM_PATH),
  ]
  // it doesn't delete the dir itself, to prevent IDE jumping
  _emptyDirSync('./dist')
  _emptyDirSync('./dist-esm')
  // fs.rmSync('./dist', { recursive: true, force: true }),
  // fs.rmSync('./dist-esm', { recursive: true, force: true }),

  const cjsPath = cjsExists ? TSCONF_CJS_PATH : TSCONF_PATH
  const esmPath = esmExists ? TSCONF_ESM_PATH : TSCONF_PATH

  await Promise.all([
    execCommand(`tsc -P ${cjsPath} --outDir ./dist --module commonjs`),
    execCommand(`tsc -P ${esmPath} --outDir ./dist-esm --module esnext --declaration false`),
  ])
}
