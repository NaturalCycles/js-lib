import { exec2, fs2, kpySync } from '@naturalcycles/nodejs-lib'

export async function buildEsmCjs(): Promise<void> {
  // You cannot have a shared `tsconfig.prod.json` because of relative paths for `include`
  const TSCONF_CJS_PATH = `./tsconfig.cjs.prod.json`
  const TSCONF_ESM_PATH = `./tsconfig.esm.prod.json`
  const TSCONF_PROD_PATH = `./tsconfig.prod.json`

  const cjsExists = fs2.pathExists(TSCONF_CJS_PATH)
  const esmExists = fs2.pathExists(TSCONF_ESM_PATH)

  // it doesn't delete the dir itself, to prevent IDE jumping
  fs2.emptyDir('./dist')
  fs2.emptyDir('./dist-esm')

  buildCopy()

  const cjsPath = cjsExists ? TSCONF_CJS_PATH : TSCONF_PROD_PATH
  const esmPath = esmExists ? TSCONF_ESM_PATH : TSCONF_PROD_PATH

  await Promise.all([
    exec2.spawnAsync('tsc', {
      args: [
        '-P',
        cjsPath,
        '--outDir',
        './dist',
        '--module',
        'nodenext',
        '--moduleResolution',
        'nodenext',
        '--noEmit',
        'false',
        '--noCheck',
      ],
      shell: false,
    }),
    exec2.spawnAsync('tsc', {
      args: [
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
        '--noEmit',
        'false',
        '--noCheck',
      ],
      shell: false,
    }),
  ])
}

export async function buildProd(): Promise<void> {
  fs2.emptyDir('./dist') // it doesn't delete the dir itself, to prevent IDE jumping
  buildCopy()
  await runTSCProd()
}

/**
 * Use '.' to indicate root.
 */
export async function runTSCInFolders(
  tsconfigPaths: string[],
  args: string[] = [],
  parallel = true,
): Promise<void> {
  if (parallel) {
    await Promise.all(tsconfigPaths.map(p => runTSCInFolder(p, args)))
  } else {
    for (const p of tsconfigPaths) {
      await runTSCInFolder(p, args)
    }
  }
}

/**
 * Pass '.' to run in root.
 */
export async function runTSCInFolder(tsconfigPath: string, args: string[] = []): Promise<void> {
  if (!fs2.pathExists(tsconfigPath)) {
    console.log(`Skipping to run tsc for ${tsconfigPath}, as it doesn't exist`)
    return
  }

  await exec2.spawnAsync(`tsc`, {
    args: ['-P', tsconfigPath, ...args],
    shell: false,
  })
}

export async function runTSCProd(args: string[] = []): Promise<void> {
  const tsconfigPath = [`./tsconfig.prod.json`].find(p => fs2.pathExists(p)) || 'tsconfig.json'

  await exec2.spawnAsync(`tsc`, {
    args: ['-P', tsconfigPath, '--noEmit', 'false', '--noCheck', ...args],
    shell: false,
  })
}

export function buildCopy(): void {
  const baseDir = 'src'
  const inputPatterns = [
    '**',
    '!**/*.ts',
    '!**/__snapshots__',
    '!**/__exclude',
    '!test',
    '!**/*.test.js',
  ]
  const outputDir = 'dist'

  kpySync({
    baseDir,
    inputPatterns,
    outputDir,
    dotfiles: true,
  })
}
