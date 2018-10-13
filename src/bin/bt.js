#!/usr/bin/env node

const { execCommand } = require('../util/exec.util')

// `test` needs full path, cause, I guess, it conflicts with native OS `test` command?..
execCommand(`build && test-compile && yarn test`)
