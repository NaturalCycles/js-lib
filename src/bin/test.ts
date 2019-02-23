#!/usr/bin/env node

/*

1. Detects `full-icu` support, sets NODE_ICU_DATA if needed.
2. Adds `--silent` if running all tests at once.

 */

import { proxyCommand } from '../util/exec.util'
import { getFullICUPathIfExists, getJestConfig, isRunningAllTests } from '../util/test.util'

const fullICUPath = getFullICUPathIfExists()

const tokens = [fullICUPath && `NODE_ICU_DATA=${fullICUPath}`, 'jest', getJestConfig()].filter(
  t => t,
)

if (isRunningAllTests()) {
  // Running all tests - will use `--silent` to suppress console-logs
  tokens.push('--silent')
}

const cmd = tokens.join(' ')

void proxyCommand(cmd)
