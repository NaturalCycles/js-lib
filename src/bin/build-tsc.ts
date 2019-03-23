#!/usr/bin/env node

import { buildTscCommand } from '../cmd/build-tsc.command'

buildTscCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
