#!/usr/bin/env node

import { proxyCommand } from '../util/exec.util'
import { getFullICUPathIfExists, getJestConfig } from '../util/test.util'

const fullICUPath = getFullICUPathIfExists()

const cmd = [
  fullICUPath && `NODE_ICU_DATA=${fullICUPath}`,
  'JEST_SILENT=1 jest --ci --coverage --maxWorkers=7 --silent',
  getJestConfig(),
]
  .filter(t => t)
  .join(' ')

void proxyCommand(cmd)
