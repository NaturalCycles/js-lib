#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { prettierAllCommand } from '../cmd/prettier-all.command'

runScript(prettierAllCommand)
