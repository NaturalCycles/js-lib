import { jestLog, jestLogger, jestOffline } from '@naturalcycles/dev-lib/dist/testing'
import { polyfillDispose } from '../polyfill'

polyfillDispose()
jestOffline()

// Patch console functions so jest doesn't log it so verbose
console.log = console.warn = console.debug = jestLog
console.error = jestLogger.error.bind(jestLogger)
