import { jestLog } from './testing'

const LOCAL_HOSTS = ['localhost', '127.0.0.1']

const detectLeaks = process.argv.some(a => a.includes('detectLeaks'))

let mitm: any

/**
 * Based on: https://github.com/palmerj3/jest-offline/blob/master/index.js
 */
export function jestOffline(): void {
  if (detectLeaks) {
    jestLog('NOT applying jestOffline() when --detectLeaks is on')
    return
  }

  jestLog('jest offline mode')
  const createMitm = require('mitm')
  mitm ||= createMitm()

  mitm.on('connect', (socket: any, opts: any) => {
    const { host } = opts

    if (!LOCAL_HOSTS.includes(host as string)) {
      throw new Error(`Network request forbidden by jestOffline(): ${host}`)
    }

    socket.bypass()
  })
}

/**
 * Undo/reset the jestOffline() function by allowing network calls again.
 */
export function jestOnline(): void {
  mitm?.disable()
}
