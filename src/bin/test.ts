#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { runJest } from '../util/jest.util'

runScript(async () => {
  runJest()
})
