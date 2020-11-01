#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import * as fs from 'fs-extra'
import { tscScriptsCommand } from '../cmd/tsc-scripts.command'
import { tsc } from '../util/tsc.util'

runScript(async () => {
  fs.emptyDirSync('./dist')
  await tsc()
  await tscScriptsCommand()
})
