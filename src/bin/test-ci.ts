#!/usr/bin/env node

import { execCommand } from '../util/exec.util'
import { getFullICUPathIfExists } from '../util/test.util'

const fullICUPath = getFullICUPathIfExists()

const cmd = [fullICUPath && `NODE_ICU_DATA=${fullICUPath}`, 'jest --ci --coverage --maxWorkers=7']
  .filter(t => t)
  .join(' ')

void execCommand(cmd)
