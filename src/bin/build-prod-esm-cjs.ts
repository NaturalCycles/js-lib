#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { buildProdESMCJSCommand } from '../cmd/build-prod-esm-cjs.command'

runScript(buildProdESMCJSCommand)
