import { existsSync } from 'node:fs'
import { exec2 } from '@naturalcycles/nodejs-lib'

export function up(): void {
  exec2.spawn('yarn upgrade')
  exec2.spawn('yarn-deduplicate')
  exec2.spawn('yarn')

  if (existsSync(`node_modules/patch-package`)) {
    exec2.spawn('patch-package')
  }
}

export function upnc(): void {
  exec2.spawn('yarn upgrade --pattern @naturalcycles')
  exec2.spawn('yarn-deduplicate')
  exec2.spawn('yarn')
}
