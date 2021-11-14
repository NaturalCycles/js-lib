#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { buildProdCommand } from '../cmd/build-prod.command'

runScript(buildProdCommand)
