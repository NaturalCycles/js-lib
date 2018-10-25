#!/usr/bin/env node

import { execCommand } from '../util/exec.util'

void execCommand(`tsc -p tsconfig.test.json`)
