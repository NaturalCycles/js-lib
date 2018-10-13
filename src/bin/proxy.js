#!/usr/bin/env node

const { execCommand } = require('../util/exec.util')

const [,,cmd] = process.argv

if (!cmd) {
  console.error('proxy.js is missing first argument!')
  process.exit(1)
}

execCommand(cmd)
