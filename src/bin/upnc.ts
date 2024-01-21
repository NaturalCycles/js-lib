#!/usr/bin/env node

import { execVoidCommandSync, runScript } from '@naturalcycles/nodejs-lib'

runScript(async () => {
  execVoidCommandSync('yarn', ['upgrade', '--pattern', `@naturalcycles`])
  execVoidCommandSync('yarn-deduplicate')
  execVoidCommandSync('yarn')
})
