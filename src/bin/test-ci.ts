#!/usr/bin/env node

import { testCICommand } from '../test-ci.command'

testCICommand().catch(err => {
  console.error(err)
  process.exit(1)
})
