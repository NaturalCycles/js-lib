import { execWithArgs } from '@naturalcycles/nodejs-lib/dist/exec'
import * as fs from 'fs'
import { cfgDir } from '../cnst/paths.cnst'

const { prettierDirs, stylelintExtensions, lintExclude } = require('../../cfg/_cnst')

export const stylelintPaths = [
  // Everything inside these folders
  `./{${prettierDirs}}/**/*.{${stylelintExtensions}}`,

  // Exclude
  ...lintExclude.map((s: string) => `!${s}`),
]

export async function stylelintAll(): Promise<void> {
  const config = [`./stylelint.config.js`, `${cfgDir}/stylelint.config.js`].find(f =>
    fs.existsSync(f),
  )!

  const args = [`--fix`, `--allow-empty-input`, `--config`, config, ...stylelintPaths]

  await execWithArgs('stylelint', args)
}
