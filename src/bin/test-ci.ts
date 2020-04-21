#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { testCICommand } from '../cmd/test-ci.command'

runScript(testCICommand, { noExit: true })
