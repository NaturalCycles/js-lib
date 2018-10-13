#!/usr/bin/env node

const { execCommand } = require('../util/exec.util')

execCommand(`tsc -p tsconfig.test.json`)
