/*

yarn tsx scripts/colors.script.ts

 */

import type { ColorName, ModifierName } from 'chalk'
import chalk from 'chalk'
import { runScript } from '../src/script/runScript.js'

const s = 'Hello World! 1 2 3 4 5ms'

const colors: ColorName[] = ['white', 'grey', 'yellow', 'green', 'red', 'blue', 'magenta', 'cyan']
const modifiers: ModifierName[] = ['dim', null as any, 'bold', 'inverse']

runScript(async () => {
  colors.forEach(color => {
    modifiers.forEach(mod => {
      if (mod) {
        console.log(chalk[color][mod](`${s} ${mod} ${color}`))
      } else {
        console.log(chalk[color](`${s} ${color}`))
      }
    })
  })
})
