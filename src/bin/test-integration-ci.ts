#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { testIntegrationCiCommand } from '../cmd/test-integration-ci.command'

runScript(testIntegrationCiCommand)
