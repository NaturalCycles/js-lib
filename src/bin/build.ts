#!/usr/bin/env node

import { buildCommand } from '../build.command'

buildCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
