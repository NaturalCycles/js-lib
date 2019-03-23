#!/usr/bin/env node

import { lintStagedDefCommand } from '../cmd/lint-staged-def.command'

lintStagedDefCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
