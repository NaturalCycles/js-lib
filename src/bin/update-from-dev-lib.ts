#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { updateFromDevLibCommand } from '../cmd/update-from-dev-lib.command'

runScript(updateFromDevLibCommand)
