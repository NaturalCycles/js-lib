#!/usr/bin/env node

const { proxyCommand } = require('../util/exec.util')

proxyCommand(`jest`)
