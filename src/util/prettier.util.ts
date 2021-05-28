import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { cfgDir } from '../cnst/paths.cnst'
const { prettierDirs, prettierExtensions, lintExclude } = require('../../cfg/_cnst')

export const prettierPaths = [
  // Everything inside these folders
  `./{${prettierDirs}}/**/*.{${prettierExtensions},ts,tsx,css,scss}`,

  // Root
  `./*.{${prettierExtensions},ts,tsx,css,scss}`,

  // Exclude
  ...lintExclude.map((s: string) => `!${s}`),
]

export async function runPrettier(): Promise<void> {
  // If there's no `prettier.config.js` in target project - pass `./cfg/prettier.config.js`
  const prettierConfigPath =
    [`./prettier.config.js`].find(f => fs.existsSync(f)) || `${cfgDir}/prettier.config.js`

  // prettier --write 'src/**/*.{js,ts,css,scss,graphql}'
  const args = [`--write`, `--config`, prettierConfigPath, ...prettierPaths]

  await execWithArgs('prettier', args)
}
