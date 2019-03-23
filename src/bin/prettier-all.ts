#!/usr/bin/env node

import { prettierAllCommand } from '../cmd/prettier-all.command'

prettierAllCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
