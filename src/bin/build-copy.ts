#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { buildCopyCommand } from '../cmd/build-copy.command'

runScript(buildCopyCommand)
