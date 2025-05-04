#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { up } from '../yarn.util.js'

runScript(async () => {
  up()
})
