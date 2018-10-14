#!/usr/bin/env node

/**
 * Runs `prettier` and `tslint` for all predefined paths (e.g /src, etc)
 */

import { runPrettier, runTSLint } from '../util/prettier.util'
; (async () => {
  await runPrettier()
  await runTSLint()
})()
