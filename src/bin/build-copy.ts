#!/usr/bin/env node

import chalk from 'chalk'
import * as cpy from 'cpy'

const patterns = ['**/*', '!**/*.{ts,js}', '!**/__snapshots__']
const dest = '../dist'
const opts = { cwd: 'src', parents: true }
const cmd = `cpy(${patterns}, ${dest}, ${JSON.stringify(opts)})`
console.log(chalk.grey(cmd))

void cpy(patterns, dest, opts)
