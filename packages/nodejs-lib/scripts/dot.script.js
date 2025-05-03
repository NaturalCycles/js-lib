/*

node scripts/dot.script.js
node scripts/dot.script.js --count 3

 */

import { parseArgs } from 'node:util'
import { pDelay } from '@naturalcycles/js-lib'
const { count: countStr, error } = parseArgs({
  options: {
    count: {
      type: 'string',
      default: '3',
    },
    error: {
      type: 'boolean',
      default: false,
    },
  },
}).values

const count = Number(countStr)

console.log('very first line')
console.log({
  count,
  error,
})
;(async () => {
  for (let i = 1; i <= count; i++) {
    await pDelay(1000)
    console.log(i)
  }
  if (error) {
    console.log('the error')
    return process.exit(1)
  }
  console.log('done')
})()
