#!/usr/bin/env node

/**
 * Runs `prettier` command for all predefined paths (e.g /src, etc).
 * Does NOT run `tslint` after (use `prettier-all` for that)
 */

const { runPrettier } = require('../util/prettier.util')

runPrettier()
