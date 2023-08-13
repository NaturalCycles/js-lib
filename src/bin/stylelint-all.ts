#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { stylelintAll } from '../util/stylelint.util'

runScript(async () => {
  stylelintAll()
})
