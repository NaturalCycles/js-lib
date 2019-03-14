#!/usr/bin/env node

import { tsnScriptCommand } from '../tsn-script.command'

tsnScriptCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
