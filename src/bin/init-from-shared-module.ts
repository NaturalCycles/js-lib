#!/usr/bin/env node

import cpy from 'cpy'
import { cfgDir } from '../cnst/paths.cnts'

const overwriteDir = `${cfgDir}/init`

// Please be aware that it will flatten all files, unless --parents is passed
cpy(`${overwriteDir}/**/{*,.*}`, './')
