#!/usr/bin/env node

import { commitlintDefCommand } from '../commitlint-def.command'

commitlintDefCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
