#!/usr/bin/env node

import { initFromDevLibCommand } from '../cmd/init-from-dev-lib.command'

initFromDevLibCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
