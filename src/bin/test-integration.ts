#!/usr/bin/env node

import { testIntegrationCommand } from '../cmd/test-integration.command'

testIntegrationCommand().catch(err => {
  console.error(err)
  process.exit(1)
})
