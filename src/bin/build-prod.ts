#!/usr/bin/env node

import { execCommand } from '../util/exec.util'

void execCommand(`clean-dist && build-copy && build-tsc-prod`)
