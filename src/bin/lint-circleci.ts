#!/usr/bin/env node

import { lintCircleCICommand } from '../lint-circleci.command'

lintCircleCICommand().catch(err => {
  console.error(err)
  process.exit(1)
})
