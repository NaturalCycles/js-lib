#!/usr/bin/env node

import { runScript } from '@naturalcycles/nodejs-lib/dist/script'
import { runJest } from '../util/jest.util'

runScript(async () => {
  console.log(
    '! "yarn test-integration-ci" is deprecated, use plain `yarn test-integration` instead !',
  )
  runJest({ integration: true })
})
