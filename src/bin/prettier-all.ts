#!/usr/bin/env node

import { prettierAllCommand } from '../prettier-all.command'

prettierAllCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
