#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { lintAllCommand } from '../cmd/lint-all.command'

runScript(lintAllCommand)
