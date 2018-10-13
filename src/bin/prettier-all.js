#!/usr/bin/env node

/**
 * Runs `prettier` and `tslint` for all predefined paths (e.g /src, etc)
 */

const { runPrettier, runTSLint } = require('../util/prettier.util')
;(async () => {
  await runPrettier()
  await runTSLint()
})()
