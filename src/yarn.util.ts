import fs from 'node:fs'
import { execVoidCommandSync } from '@naturalcycles/nodejs-lib'

export function up(): void {
  execVoidCommandSync('yarn', ['upgrade'])
  execVoidCommandSync('yarn-deduplicate')
  execVoidCommandSync('yarn')

  if (fs.existsSync(`node_modules/patch-package`)) {
    execVoidCommandSync('patch-package')
  }
}

export function upnc(): void {
  execVoidCommandSync('yarn', ['upgrade', '--pattern', `@naturalcycles`])
  execVoidCommandSync('yarn-deduplicate')
  execVoidCommandSync('yarn')
}
