import { jestOffline } from '../jestOffline.util'
import { jestLog, jestLogger } from '../testing'

jestOffline()

console.log = console.warn = jestLog
console.error = jestLogger.error.bind(jestLogger)
