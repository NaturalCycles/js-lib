#!/usr/bin/env node

import { tsnScriptCommand } from '../cmd/tsn-script.command'

tsnScriptCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
