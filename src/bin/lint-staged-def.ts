#!/usr/bin/env node

import { cfgDir } from '../cnst/paths.cnts'
import { execCommand } from '../util/exec.util'

void execCommand(`lint-staged --config ${cfgDir}/lint-staged.config.js`)
