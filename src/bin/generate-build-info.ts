#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib'
import { generateBuildInfoCommand } from '../cmd/generate-build-info.command'

runScript(generateBuildInfoCommand)
