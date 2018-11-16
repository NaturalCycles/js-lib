#!/usr/bin/env node

import chalk from 'chalk'
import * as cpy from 'cpy'

const cmd = `cpy(['**/*','!**/*.{ts,js}'], '../dist', { cwd: 'src', parents: true })`
console.log(chalk.grey(cmd))

void cpy(['**/*','!**/*.{ts,js}'], '../dist', { cwd: 'src', parents: true })
