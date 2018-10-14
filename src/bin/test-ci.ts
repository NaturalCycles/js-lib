#!/usr/bin/env node

import { execCommand } from '../util/exec.util'

execCommand(`jest --ci --coverage --maxWorkers=8`)
