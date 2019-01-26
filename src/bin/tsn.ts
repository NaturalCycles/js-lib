#!/usr/bin/env node

import { proxyCommand } from '../util/exec.util'
import { nodeModuleExists } from '../util/test.util'

const cmd = ['ts-node', nodeModuleExists('tsconfig-paths') && '-r tsconfig-paths/register']
  .filter(t => t)
  .join(' ')

void proxyCommand(cmd)
