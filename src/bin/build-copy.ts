#!/usr/bin/env node

import { execCommand } from '../util/exec.util'

void execCommand(`cpx 'src/**/*.{graphql,graphqls,json,yaml,yml,html}' dist`)
