#!/usr/bin/env node

import { execCommand } from '../util/exec.util'

execCommand(`cpx 'src/**/*.{graphql,graphqls,json,yaml,yml,html}' dist`)
