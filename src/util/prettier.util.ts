import { prettierPaths, tslintExcludePaths, tslintPaths } from '../cnst/prettier.cnst'
import { execCommand } from './exec.util'

export async function runPrettier (): Promise<number> {
  // prettier --write 'src/**/*.{js,ts,css,scss,graphql}'
  const cmd = [`prettier --write`, ...prettierPaths.map(p => `'${p}'`)].join(' ')

  // console.log(cmd)

  return execCommand(cmd)
}

export async function runTSLint (): Promise<number> {
  // tslint './src/**/*.ts' -e './src/@linked' -p tsconfig.json -t stylish --fix
  const cmd = [
    `tslint`,
    ...tslintPaths.map(p => `'${p}'`),
    ...tslintExcludePaths.map(p => `-e '${p}'`),
    `-p tsconfig.json -t stylish --fix`,
  ].join(' ')

  // console.log(cmd)

  return execCommand(cmd)
}
