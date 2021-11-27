#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { runJest } from '../util/jest.util'

runScript(async () => {
  console.log('! "yarn test-ci" is deprecated, use plain `yarn test` instead !')
  await runJest()
})
