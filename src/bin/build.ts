#!/usr/bin/env node

import { _emptyDirSync } from '@naturalcycles/nodejs-lib'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { tscMainAndScripts } from '../util/tsc.util'

runScript(async () => {
  _emptyDirSync('./dist') // it doesn't delete the dir itself, to prevent IDE jumping
  // fs.rmSync('./dist', { recursive: true, force: true })
  await tscMainAndScripts(true)
})
