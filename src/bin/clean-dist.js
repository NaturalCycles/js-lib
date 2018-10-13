#!/usr/bin/env node

const { execCommand } = require('../util/exec.util')

execCommand(`del ./dist`)
