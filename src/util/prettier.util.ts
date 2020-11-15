import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { cfgDir } from '../cnst/paths.cnst'
const { prettierDirs, prettierExtensions, lintExclude } = require('../../cfg/_cnst')

export const prettierPaths = [
  // Everything inside these folders
  `./{${prettierDirs}}/**/*.{${prettierExtensions},ts,tsx}`,

  // Root
  `./*.{${prettierExtensions},ts,tsx}`,

  // Exclude
  ...lintExclude.map((s: string) => `!${s}`),
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
