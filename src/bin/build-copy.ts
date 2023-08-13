#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { buildCopyCommand } from '../cmd/build-copy.command'

runScript(buildCopyCommand)
