#!/usr/bin/env node

import * as cpx from 'cpx'

const overwriteDir = `./node_modules/@naturalcycles/shared-module/cfg/overwrite`

cpx.copy(`${overwriteDir}/**/{*,.*}`, './')
