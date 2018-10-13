#!/usr/bin/env node

const { prettierPaths } = require('../cnst/prettier.cnst')
const { execCommand } = require('../util/exec.util')

// console.log(prettierPaths)

const cmd = `prettier --write ` + prettierPaths.map(p => `'${p}'`).join(' ')
// console.log(cmd)
// spawn(cmd, { stdio: 'inherit' })

execCommand(cmd)
