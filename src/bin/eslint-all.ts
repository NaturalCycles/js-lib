#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { eslintAllCommand } from '../cmd/eslint-all.command'

runScript(eslintAllCommand)
