#!/usr/bin/env node

import { testLeaksCommand } from '../cmd/test-leaks.command'

testLeaksCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
