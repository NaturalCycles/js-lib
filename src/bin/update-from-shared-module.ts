#!/usr/bin/env node

import { kpy } from 'kpy'
import { cfgOverwriteDir } from '../cnst/paths.cnts'

kpy({
  baseDir: cfgOverwriteDir,
  outputDir: './',
  dotfiles: true,
  verbose: true,
}).catch(err => {
  console.error(err)
  process.exit(1)
})
