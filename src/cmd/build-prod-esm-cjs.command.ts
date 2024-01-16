import { execVoidCommand, fs2 } from '@naturalcycles/nodejs-lib'

// You cannot have a shared `tsconfig.prod.json` because of relative paths for `include`
const TSCONF_CJS_PATH = `./tsconfig.cjs.prod.json`
const TSCONF_ESM_PATH = `./tsconfig.esm.prod.json`
const TSCONF_PATH = `./tsconfig.prod.json`

export async function buildProdESMCJSCommand(): Promise<void> {
  const cjsExists = fs2.pathExists(TSCONF_CJS_PATH)
  const esmExists = fs2.pathExists(TSCONF_ESM_PATH)

  // it doesn't delete the dir itself, to prevent IDE jumping
  fs2.emptyDir('./dist')
  fs2.emptyDir('./dist-esm')

  const cjsPath = cjsExists ? TSCONF_CJS_PATH : TSCONF_PATH
  const esmPath = esmExists ? TSCONF_ESM_PATH : TSCONF_PATH

  await Promise.all([
    execVoidCommand('tsc', [
      '-P',
      cjsPath,
      '--outDir',
      './dist',
      '--module',
      'nodenext',
      '--moduleResolution',
      'nodenext',
    ]),
    execVoidCommand('tsc', [
      '-P',
      esmPath,
      '--outDir',
      './dist-esm',
      '--module',
      'esnext',
      '--moduleResolution',
      'bundler',
      '--declaration',
      'false',
    ]),
  ])
}
