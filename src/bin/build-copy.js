#!/usr/bin/env node

const { execCommand } = require('../util/exec.util')

execCommand(`cpx 'src/**/*.{graphql,graphqls,json,yaml,yml,html}' dist`)
