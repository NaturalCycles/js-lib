#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { testLeaksCommand } from '../cmd/test-leaks.command'

runScript(testLeaksCommand, { noExit: true })
