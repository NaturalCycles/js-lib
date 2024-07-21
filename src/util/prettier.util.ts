import fs from 'node:fs'
import { execVoidCommandSync } from '@naturalcycles/nodejs-lib'
const { prettierDirs, prettierExtensionsAll, lintExclude } = require('../../cfg/_cnst')

const prettierPaths = [
  // Everything inside these folders
  `./{${prettierDirs}}/**/*.{${prettierExtensionsAll}}`,

  // Root
  `./*.{${prettierExtensionsAll}}`,

  // Exclude
  ...lintExclude.map((s: string) => `!${s}`),
]

export function runPrettier(): void {
  const prettierConfigPath = [`./prettier.config.js`].find(f => fs.existsSync(f))
  if (!prettierConfigPath) return

  // prettier --write 'src/**/*.{js,ts,css,scss,graphql}'
  const args = [`--write`, `--log-level=warn`, `--config`, prettierConfigPath, ...prettierPaths]

  execVoidCommandSync('prettier', args)
}
