#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { tslintAllCommand } from '../cmd/tslint-all.command'

runScript(tslintAllCommand)
