#!/usr/bin/env node

import { execCommand } from '../util/exec.util'

const [, , cmd, ...args] = process.argv

if (!cmd) {
  console.error('proxy.js is missing first argument!')
  process.exit(1)
}

void execCommand(cmd, args)
