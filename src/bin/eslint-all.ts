#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { eslintAllCommand } from '../cmd/eslint-all.command'

runScript(eslintAllCommand)
