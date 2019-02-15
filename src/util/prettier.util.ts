import * as fs from 'fs-extra'
import { cfgDir } from '../cnst/paths.cnts'
import {
  prettierPaths,
  tslintExcludePaths,
  tslintPaths,
  tslintScriptsPaths,
} from '../cnst/prettier.cnst'
import { execCommand } from './exec.util'

export async function runPrettier (): Promise<number> {
  // If there's no `prettier.config.js` in target project - pass `./cfg/prettier.config.js`
  const cwd = process.cwd()
  const localConfig = `${cwd}/prettier.config.js`
  const sharedConfig = `${cfgDir}/prettier.config.js`
  const config = fs.pathExistsSync(localConfig) ? localConfig : sharedConfig

  // prettier --write 'src/**/*.{js,ts,css,scss,graphql}'
  const cmd = [`prettier --write --config ${config}`, ...prettierPaths.map(p => `'${p}'`)]
    .filter(v => v)
    .join(' ')

  // console.log(cmd)

  return execCommand(cmd)
}

export async function runTSLint (): Promise<number> {
  //
  // 1. Run for /src
  //
  let code = await doRunTSLint(tslintPaths, tslintExcludePaths, 'tsconfig.json')
  if (code) return code

  //
  // 2. If '/scripts' folder exists - run tslint there too
  //
  const cwd = process.cwd()
  const scriptsProject = `${cwd}/scripts`
  const scriptsTSConfigJson = `${scriptsProject}/tsconfig.json`
  if (fs.pathExistsSync(scriptsProject) && fs.pathExistsSync(scriptsTSConfigJson)) {
    code = await doRunTSLint(tslintScriptsPaths, tslintExcludePaths, scriptsTSConfigJson)
  }

  return code
}

export async function doRunTSLint (
  paths: string[],
  excludePaths: string[] = [],
  tsconfigPath?: string,
): Promise<number> {
  // Find tslint config in target dir or use default
  const cwd = process.cwd()
  const localConfig = `${cwd}/tslint.json`
  const sharedConfig = `${cfgDir}/tslint.config.js`
  const config = fs.pathExistsSync(localConfig) ? localConfig : sharedConfig

  // Due to "slowness issue" we run TSLint twice - first without project, secondly - with project
  // This makes it way faster

  //
  // Run 1 - without project
  // tslint './src/**/*.ts' -e './src/@linked' -t stylish --fix
  //
  let cmd = [
    `tslint --config ${config}`,
    ...paths.map(p => `'${p}'`),
    ...excludePaths.map(p => `-e '${p}'`),
    `-t stylish --fix`,
  ]
    .filter(v => v)
    .join(' ')

  const code = await execCommand(cmd)
  if (code || !tsconfigPath) return code

  //
  // Run 2 - with project
  // tslint './src/**/*.ts' -e './src/@linked' -p tsconfig.json -t stylish --fix
  //
  cmd = [
    `tslint --config ${config}`,
    ...paths.map(p => `'${p}'`),
    ...excludePaths.map(p => `-e '${p}'`),
    `-p ${tsconfigPath}`,
    `-t stylish --fix`,
  ]
    .filter(v => v)
    .join(' ')

  return execCommand(cmd)
}
