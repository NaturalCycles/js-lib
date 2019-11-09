#!/usr/bin/env node

import { buildProdESMCJSCommand } from '../cmd/build-prod-esm-cjs.command'

buildProdESMCJSCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
