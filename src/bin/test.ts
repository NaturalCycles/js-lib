#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { testCommand } from '../cmd/test.command'

runScript(testCommand, { noExit: true })
