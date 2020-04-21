#!/usr/bin/env node

import { testCommand } from '../cmd/test.command'

// not runScript, because there's some dark magic happening with jest
testCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
