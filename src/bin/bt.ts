#!/usr/bin/env node

import { btCommand } from '../bt.command'

btCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
