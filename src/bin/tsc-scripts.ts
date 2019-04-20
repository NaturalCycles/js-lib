#!/usr/bin/env node

import { tscScriptsCommand } from '../cmd/tsc-scripts.command'

tscScriptsCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
