#!/usr/bin/env node

const { execCommand } = require('../util/exec.util')

execCommand(`clean-dist && build-copy | build-tsc`)
