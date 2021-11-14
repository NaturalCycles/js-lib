#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { runPrettier } from '../util/prettier.util'

runScript(async () => {
  await runPrettier()
})
