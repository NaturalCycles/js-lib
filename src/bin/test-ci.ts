#!/usr/bin/env node

import { execCommand } from '../util/exec.util'

void execCommand(`jest --ci --coverage --maxWorkers=8`)
