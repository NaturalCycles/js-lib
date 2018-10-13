#!/usr/bin/env node

/**
 * Runs `tslint` command for all predefined paths (e.g /src, etc).
 */

const { runTSLint } = require('../util/prettier.util')

runTSLint()
