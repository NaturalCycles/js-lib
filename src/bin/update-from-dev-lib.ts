#!/usr/bin/env node

import { kpySync } from '@naturalcycles/nodejs-lib'
import { runScript } from '@naturalcycles/nodejs-lib'
import { cfgOverwriteDir } from '../cnst/paths.cnst'

runScript(() => {
  kpySync({
    baseDir: cfgOverwriteDir,
    outputDir: './',
    dotfiles: true,
    verbose: true,
  })
})
