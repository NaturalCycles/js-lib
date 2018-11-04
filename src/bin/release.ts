#!/usr/bin/env node

import { cfgDir } from '../cnst/paths.cnts'
const semanticRelease = require('semantic-release')
const defConfig = require(`${cfgDir}/release.config`)

// const cmd = `yarn semantic-release`
// void proxyCommand(cmd)
semanticRelease(defConfig).catch((err: any) => {
  console.error(err)
  process.exit(1)
})
