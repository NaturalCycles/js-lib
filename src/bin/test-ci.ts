#!/usr/bin/env node

import { testCICommand } from '../cmd/test-ci.command'

// not runScript, because there's some dark magic happening with jest
testCICommand().catch(err => {
  console.error(err)
  process.exit(1)
})
