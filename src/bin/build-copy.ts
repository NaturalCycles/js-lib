#!/usr/bin/env node

import { buildCopyCommand } from '../build-copy.command'

buildCopyCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
