import * as fs from 'fs-extra'
import { cfgDir } from '../cnst/paths.cnst'
import { execCommand } from './exec.util'

export const prettierExtensions = `css,scss,ts,tsx,js,jsx,json,md,graphql,yml,yaml,html,vue`

export const prettierPaths: string[] = [
  // Everything inside these folders
  `./{src,scripts,doc,cfg,.circleci}/**/*.{${prettierExtensions}}`,

  // Root
  `./*.{${prettierExtensions}},!./CHANGELOG.md`,
]

export async function runPrettier (): Promise<number> {
  // If there's no `prettier.config.js` in target project - pass `./cfg/prettier.config.js`
  const localConfig = `./prettier.config.js`
  const sharedConfig = `${cfgDir}/prettier.config.js`
  const config = fs.pathExistsSync(localConfig) ? localConfig : sharedConfig

  // prettier --write 'src/**/*.{js,ts,css,scss,graphql}'
  const cmd = 'prettier'
  const args = [`--write`, ` --config ${config}`, ...prettierPaths.map(p => `'${p}'`)].filter(
    v => v,
  )

  // console.log(cmd)

  return execCommand(cmd, args)
}
