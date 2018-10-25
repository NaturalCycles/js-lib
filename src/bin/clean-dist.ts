#!/usr/bin/env node

import { execCommand } from '../util/exec.util'

void execCommand(`del ./dist`)
