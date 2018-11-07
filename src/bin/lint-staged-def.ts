#!/usr/bin/env node

import * as fs from 'fs-extra'
import { cfgDir } from '../cnst/paths.cnts'
import { execCommand } from '../util/exec.util'

const cwd = process.cwd()
const localConfig = `${cwd}/lint-staged.config.js`
const sharedConfig = `${cfgDir}/lint-staged.config.js`
const config = fs.pathExistsSync(localConfig) ? localConfig : sharedConfig

void execCommand(`lint-staged --config ${config}`)
