#!/usr/bin/env node

const cpx = require('cpx')

const overwriteDir = `./node_modules/@naturalcycles/shared-module/cfg/init`

cpx.copy(`${overwriteDir}/**/{*,.*}`, './')
