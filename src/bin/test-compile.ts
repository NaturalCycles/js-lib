#!/usr/bin/env node

import { execCommand } from '../util/exec.util'

execCommand(`tsc -p tsconfig.test.json`)
