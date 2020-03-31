#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { lintStagedDefCommand } from '../cmd/lint-staged-def.command'

runScript(lintStagedDefCommand)
