#!/usr/bin/env node

import fs from 'node:fs'
import { execVoidCommandSync, runScript } from '@naturalcycles/nodejs-lib'

runScript(async () => {
  execVoidCommandSync('yarn', ['upgrade'])

  if (fs.existsSync(`node_modules/patch-package`)) {
    execVoidCommandSync('patch-package')
  }
})
