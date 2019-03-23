#!/usr/bin/env node

import { lintAllCommand } from '../cmd/lint-all.command'

lintAllCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
