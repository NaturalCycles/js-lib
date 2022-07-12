#!/usr/bin/env node

import { kpySync } from '@naturalcycles/nodejs-lib/dist/fs'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { cfgOverwriteDir } from '../cnst/paths.cnst'

runScript(() => {
  kpySync({
    baseDir: cfgOverwriteDir,
    outputDir: './',
    dotfiles: true,
    verbose: true,
  })
})
