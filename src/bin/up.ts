#!/usr/bin/env node

import fs from 'node:fs'
import { execVoidCommandSync, runScript } from '@naturalcycles/nodejs-lib'

runScript(async () => {
  execVoidCommandSync('yarn', ['upgrade'])
  execVoidCommandSync('yarn-deduplicate')
  execVoidCommandSync('yarn')

  if (fs.existsSync(`node_modules/patch-package`)) {
    execVoidCommandSync('patch-package')
  }
})
