#!/usr/bin/env node

import { fs2, runScript } from '@naturalcycles/nodejs-lib'
import { runJest } from '../util/jest.util'
import { tscMainAndScripts } from '../util/tsc.util'

runScript(async () => {
  fs2.emptyDir('./dist') // it doesn't delete the dir itself, to prevent IDE jumping
  // fs.rmSync('./dist', { recursive: true, force: true })

  await tscMainAndScripts(true)
  runJest()
})
