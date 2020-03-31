#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { generateBuildInfoCommand } from '../cmd/generate-build-info.command'

runScript(generateBuildInfoCommand)
