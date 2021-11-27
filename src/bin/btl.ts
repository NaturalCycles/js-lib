#!/usr/bin/env node

import * as fs from 'fs-extra'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { lintAllCommand } from '../cmd/lint-all.command'
import { tscScriptsCommand } from '../cmd/tsc-scripts.command'
import { runJest } from '../util/jest.util'
import { tsc } from '../util/tsc.util'

runScript(async () => {
  await lintAllCommand()
  fs.emptyDirSync('./dist') // it doesn't delete the dir itself, to prevent IDE jumping
  // fs.rmSync('./dist', { recursive: true, force: true })
  await tsc()
  await tscScriptsCommand()
  await runJest()
})
