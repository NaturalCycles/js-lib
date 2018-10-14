#!/usr/bin/env node

import { execCommand } from '../util/exec.util'

execCommand(`clean-dist && build-copy | build-tsc`)
