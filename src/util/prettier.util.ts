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
  // Due to "slowness issue" we run TSLint twice - first without project, secondly - with project
  // This makes it way faster

  // Run 1 - without project
  // tslint './src/**/*.ts' -e './src/@linked' -t stylish --fix
  let cmd = [
    `tslint`,
    ...tslintPaths.map(p => `'${p}'`),
    ...tslintExcludePaths.map(p => `-e '${p}'`),
    `-t stylish --fix`,
  ].join(' ')

  await execCommand(cmd)

  // Run 2 - with project
  // tslint './src/**/*.ts' -e './src/@linked' -p tsconfig.json -t stylish --fix
  cmd = [
    `tslint`,
    ...tslintPaths.map(p => `'${p}'`),
    ...tslintExcludePaths.map(p => `-e '${p}'`),
    `-p ${p} -t stylish --fix`,
  ].join(' ')

  return execCommand(cmd)
}
