#!/usr/bin/env node

import * as fs from 'fs-extra'
import { execCommand } from '../util/exec.util'

fs.emptyDirSync('./dist')

void execCommand(`build-tsc`)
