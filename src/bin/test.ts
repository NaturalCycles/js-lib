#!/usr/bin/env node

import { testCommand } from '../cmd/test.command'

testCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
