#!/usr/bin/env node

import * as cpy from 'cpy'

void cpy('**/*.{graphql,graphqls,json,yaml,yml,html}', '../dist', { cwd: 'src', parents: true })
