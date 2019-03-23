#!/usr/bin/env node

import { buildTscProdCommand } from '../cmd/build-tsc-prod.command'

buildTscProdCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
