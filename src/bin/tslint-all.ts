#!/usr/bin/env node

import { tslintAllCommand } from '../cmd/tslint-all.command'

tslintAllCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
