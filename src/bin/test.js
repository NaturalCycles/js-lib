#!/usr/bin/env node

/**
 * Proxy to `jest`
 */

const { execCommand } = require('../util/exec.util')

execCommand(`jest`)
