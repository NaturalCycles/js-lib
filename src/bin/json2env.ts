#!/usr/bin/env node

import { json2envCommand } from '../cmd/json2env.command'

json2envCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
