#!/usr/bin/env node

/*

yarn deploy-prepare

 */

import { _yargs, runScript } from '@naturalcycles/nodejs-lib'
import { deployPrepare, deployPrepareYargsOptions } from '../deploy/deployPrepare.js'

runScript(async () => {
  const opt = _yargs().options(deployPrepareYargsOptions).argv

  await deployPrepare(opt)
})

// deploy strategy
// gae project: from config
// gae service: from config -- branch name
// gae version: automatic form date

// yarn build-prod
// yarn deploy-prepare && ./tmp/deploy/app.yaml && ./tmp/deploy/deployInfo.json && json2env
//
