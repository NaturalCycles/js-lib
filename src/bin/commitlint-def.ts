#!/usr/bin/env node

import { commitlintDefCommand } from '../cmd/commitlint-def.command'

commitlintDefCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
