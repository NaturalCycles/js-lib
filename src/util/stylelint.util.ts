import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { cfgDir } from '../cnst/paths.cnst'

const { prettierDirs, stylelintExtensions, lintExclude } = require('../../cfg/_cnst')

export const stylelintPaths = [
  // Everything inside these folders
  `./{${prettierDirs}}/**/*.{${stylelintExtensions},ts,tsx}`,

  // Exclude
  ...lintExclude.map((s: string) => `!${s}`),
]

export async function stylelintAll(): Promise<void> {
  const config = [`./stylelint.config.js`, `${cfgDir}/stylelint.config.js`].find(fs.existsSync)!

  const args = [`--fix`, `--allow-empty-input`, `--config`, config, ...stylelintPaths]

  await execWithArgs('stylelint', args)
}
