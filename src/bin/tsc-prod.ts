#!/usr/bin/env node

import { tscProdCommand } from '../cmd/tsc-prod.command'

tscProdCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
