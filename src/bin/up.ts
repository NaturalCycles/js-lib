#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { up } from '../yarn.util'

runScript(async () => {
  up()
})
