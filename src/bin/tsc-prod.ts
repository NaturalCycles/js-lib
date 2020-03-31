#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { tscProdCommand } from '../cmd/tsc-prod.command'

runScript(tscProdCommand)
