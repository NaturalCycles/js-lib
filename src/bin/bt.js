#!/usr/bin/env node

const { execCommand } = require('../util/exec.util')

execCommand(`build && test-compile && test`)
