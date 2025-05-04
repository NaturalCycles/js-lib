#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { upnc } from '../yarn.util.js'

runScript(async () => {
  upnc()
})
