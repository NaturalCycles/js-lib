#!/usr/bin/env node

import * as fs from 'fs'
import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { tscScriptsCommand } from '../cmd/tsc-scripts.command'
import { runJest } from '../util/jest.util'
import { tsc } from '../util/tsc.util'

runScript(async () => {
  fs.rmSync('./dist', { recursive: true, force: true })
  await tsc()
  await tscScriptsCommand()
  await runJest()
})
