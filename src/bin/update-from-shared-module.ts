#!/usr/bin/env node

import { updateFromSharedModuleCommand } from '../cmd/update-from-shared-module.command'

updateFromSharedModuleCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
