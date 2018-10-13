#!/usr/bin/env node

const { execCommand } = require('../util/exec.util')

execCommand(`jest --ci --coverage --maxWorkers=8'`)
