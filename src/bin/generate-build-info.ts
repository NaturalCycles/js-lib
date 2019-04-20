#!/usr/bin/env node

import { generateBuildInfoCommand } from '../cmd/generate-build-info.command'

generateBuildInfoCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
