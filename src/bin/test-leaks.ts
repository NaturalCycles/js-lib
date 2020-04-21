#!/usr/bin/env node

import { testLeaksCommand } from '../cmd/test-leaks.command'

// not runScript, because there's some dark magic happening with jest
testLeaksCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
