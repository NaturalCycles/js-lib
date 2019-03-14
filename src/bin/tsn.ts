#!/usr/bin/env node

import { tsnCommand } from '../tsn.command'

tsnCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
