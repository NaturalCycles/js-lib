#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { json2envCommand } from '../cmd/json2env.command'

runScript(json2envCommand)
