import { jestLog, jestLogger } from '../testing'
import { testOffline } from '../testing/testOffline.util'

testOffline()

console.log = console.warn = jestLog
console.error = jestLogger.error.bind(jestLogger)
