#!/usr/bin/env node

import { testIntegrationCiCommand } from '../cmd/test-integration-ci.command'

testIntegrationCiCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
