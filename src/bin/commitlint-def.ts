#!/usr/bin/env node

import * as fs from 'fs-extra'
import { cfgDir } from '../cnst/paths.cnts'
import { execCommand } from '../util/exec.util'

const cwd = process.cwd()
const localConfig = `${cwd}/commitlint.config.js`
const sharedConfig = `${cfgDir}/commitlint.config.js`
const config = fs.pathExistsSync(localConfig) ? localConfig : sharedConfig

void execCommand(`commitlint -E HUSKY_GIT_PARAMS --config ${config}`)
