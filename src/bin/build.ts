#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { buildCommand } from '../cmd/build.command'

runScript(buildCommand)
