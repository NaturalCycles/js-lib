#!/usr/bin/env node

import { buildCommand } from '../cmd/build.command'

buildCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
