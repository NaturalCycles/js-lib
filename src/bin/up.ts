#!/usr/bin/env node

import * as fs from 'node:fs'
import { execVoidCommandSync } from '@naturalcycles/nodejs-lib'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'

runScript(async () => {
  execVoidCommandSync('yarn', ['upgrade'])

  if (fs.existsSync(`node_modules/patch-package`)) {
    execVoidCommandSync('patch-package')
  }
})
