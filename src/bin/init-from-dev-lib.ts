#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { initFromDevLibCommand } from '../cmd/init-from-dev-lib.command'

runScript(initFromDevLibCommand)
