#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { lintAllCommand } from '../cmd/lint-all.command'

runScript(lintAllCommand)
