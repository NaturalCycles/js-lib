import { jestLog, jestLogger } from '@naturalcycles/dev-lib/dist/testing'

// Patch console functions so jest doesn't log it so verbose
console.log = console.warn = jestLog
console.error = jestLogger.error.bind(jestLogger)
