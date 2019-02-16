#!/usr/bin/env node

import * as fs from 'fs-extra'
import { projectDir } from '../cnst/paths.cnts'
import { proxyCommand } from '../util/exec.util'
import { nodeModuleExists } from '../util/test.util'

const cwd = process.cwd()
const projectTsconfigPath = `${cwd}/scripts/tsconfig.json`
const sharedTsconfigPath = `${projectDir}/scripts/tsconfig.json`
const tsconfigPath = fs.pathExistsSync(projectTsconfigPath)
  ? projectTsconfigPath
  : sharedTsconfigPath

const cmd = [
  'ts-node',
  nodeModuleExists('tsconfig-paths') && '-r tsconfig-paths/register',
  `-P ${tsconfigPath}`,
]
  .filter(t => t)
  .join(' ')

void proxyCommand(cmd)
