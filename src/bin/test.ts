#!/usr/bin/env node

import { proxyCommand } from '../util/exec.util'
import { getFullICUPathIfExists } from '../util/test.util'

const fullICUPath = getFullICUPathIfExists()

const cmd = [fullICUPath && `NODE_ICU_DATA=${fullICUPath}`, 'jest'].filter(t => t).join(' ')

void proxyCommand(cmd)
