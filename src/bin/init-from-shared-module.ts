#!/usr/bin/env node

import { initFromSharedModuleCommand } from '../init-from-shared-module.command'

initFromSharedModuleCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
