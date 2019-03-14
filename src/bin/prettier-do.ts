#!/usr/bin/env node

import { prettierDoCommand } from '../prettier-do.command'

prettierDoCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
