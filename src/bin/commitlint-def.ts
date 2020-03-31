#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { commitlintDefCommand } from '../cmd/commitlint-def.command'

runScript(commitlintDefCommand)
