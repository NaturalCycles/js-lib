import * as fs from 'fs-extra'
import { prettierPaths, tslintExcludePaths, tslintPaths } from '../cnst/prettier.cnst'
import { execCommand } from './exec.util'

export async function runPrettier (): Promise<number> {
  // prettier --write 'src/**/*.{js,ts,css,scss,graphql}'
  const cmd = [`prettier --write`, ...prettierPaths.map(p => `'${p}'`)].join(' ')

  // console.log(cmd)

  return execCommand(cmd)
}

export async function runTSLint (): Promise<number> {
  let code = await runTSLintWithProject()
  if (code) return code

  // if 'scripts' folder exists - run tslint there too
  const cwd = process.cwd()
  const scriptsProject = `${cwd}/src/scripts`
  const scriptsTSConfigJson = `${cwd}/src/scripts/tsconfig.json`
  if (fs.pathExistsSync(scriptsProject) && fs.pathExistsSync(scriptsTSConfigJson)) {
    code = await runTSLintWithProject(scriptsProject)
  }

  return code
}

export async function runTSLintWithProject (p = 'tsconfig.json'): Promise<number> {
  // tslint './src/**/*.ts' -e './src/@linked' -p tsconfig.json -t stylish --fix
  const cmd = [
    `tslint`,
    ...tslintPaths.map(p => `'${p}'`),
    ...tslintExcludePaths.map(p => `-e '${p}'`),
    `-p ${p} -t stylish --fix`,
  ].join(' ')

  // console.log(cmd)

  return execCommand(cmd)
}
