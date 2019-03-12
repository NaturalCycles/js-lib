#!/usr/bin/env node

import { kpy } from 'kpy'

const baseDir = 'src'
const inputPatterns = ['**', '!**/*.{ts,js}', '!**/__snapshots__', '**/_exclude', '!test']
const outputDir = 'dist'

kpy({
  baseDir,
  inputPatterns,
  outputDir,
}).catch(err => {
  console.error(err)
  process.exit(1)
})
