#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { buildProdCommand } from '../cmd/build-prod.command'

runScript(buildProdCommand)
