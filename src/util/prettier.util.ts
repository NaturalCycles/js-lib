import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { cfgDir } from '../cnst/paths.cnst'

export const prettierExtensions = `css,scss,ts,tsx,js,jsx,json,md,graphql,yml,yaml,html,vue`

export const prettierPaths = [
  // Everything inside these folders
  `./{src,scripts,doc,cfg,.circleci,.github,public,static}/**/*.{${prettierExtensions}}`,

  // Root
  `./*.{${prettierExtensions}}`,

  // Exclude
  '!./CHANGELOG.md',
  '!**/__exclude/**/*',
]

export async function runPrettier(): Promise<void> {
  // If there's no `prettier.config.js` in target project - pass `./cfg/prettier.config.js`
  const localConfig = `./prettier.config.js`
  const sharedConfig = `${cfgDir}/prettier.config.js`
  const config = fs.existsSync(localConfig) ? localConfig : sharedConfig

  // prettier --write 'src/**/*.{js,ts,css,scss,graphql}'
  const args = [`--write`, `--config`, config, ...prettierPaths]

  await execWithArgs('prettier', args)
}
