#!/usr/bin/env node

/*

1. Detects `full-icu` support, sets NODE_ICU_DATA if needed.
2. Adds `--silent` if running all tests at once.

 */

import { proxyCommand } from '../util/exec.util'
import { getFullICUPathIfExists, getJestConfig, isRunningAllTests } from '../util/test.util'

const fullICUPath = getFullICUPathIfExists()
const allTests = isRunningAllTests()

// Running all tests - will use `--silent` to suppress console-logs, will also set process.env.JEST_SILENT=1

const tokens = [
  allTests && `JEST_SILENT=1`,
  fullICUPath && `NODE_ICU_DATA=${fullICUPath}`,
  'jest',
  getJestConfig(),
  allTests && `--silent`,
].filter(t => t)

const cmd = tokens.join(' ')

void proxyCommand(cmd)
