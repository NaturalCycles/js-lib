#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import * as fs from 'fs-extra'
import { buildCopyCommand } from '../cmd/build-copy.command'
import { tscProdCommand } from '../cmd/tsc-prod.command'

runScript(async () => {
  await fs.emptyDir('./dist')
  await buildCopyCommand()
  await tscProdCommand()
})
