// console.log('setupJest.ts')

import { jestOffline } from '../jestOffline.util'

const detectLeaks = process.argv.some(a => a.includes('detectLeaks'))
if (!detectLeaks) {
  jestOffline() // because it actually leaks
}
