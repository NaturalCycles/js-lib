#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { testIntegrationCommand } from '../cmd/test-integration.command'

runScript(testIntegrationCommand)
