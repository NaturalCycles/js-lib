#!/usr/bin/env node

import { cfgDir } from '../cnst/paths.cnts'
import { execCommand } from '../util/exec.util'

void execCommand(`commitlint -E HUSKY_GIT_PARAMS --config ${cfgDir}/commitlint.config.js`)
