#!/usr/bin/env node

import { buildTscScriptsCommand } from '../cmd/build-tsc-scripts.command'

buildTscScriptsCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
