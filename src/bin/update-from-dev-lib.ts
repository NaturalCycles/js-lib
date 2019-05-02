#!/usr/bin/env node

import { updateFromDevLibCommand } from '../cmd/update-from-dev-lib.command'

updateFromDevLibCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
