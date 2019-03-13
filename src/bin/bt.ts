#!/usr/bin/env node

import * as fs from 'fs-extra'
import { execCommand } from '../util/exec.util'

fs.emptyDirSync('./dist')

// `test` needs full path, cause, I guess, it conflicts with native OS `test` command?..
void execCommand(`tsc && yarn test`)
