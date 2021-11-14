#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { tscScriptsCommand } from '../cmd/tsc-scripts.command'

runScript(tscScriptsCommand)
