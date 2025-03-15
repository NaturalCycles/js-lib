import { jestLog } from './index'

const LOCAL_HOSTS = ['localhost', '127.0.0.1']

const detectLeaks = process.argv.some(a => a.includes('detectLeaks'))

let mitm: any

/**
 * Based on: https://github.com/palmerj3/jest-offline/blob/master/index.js
 */
export function testOffline(): void {
  if (detectLeaks) {
    jestLog('NOT applying testOffline() when --detectLeaks is on')
    return
  }

  jestLog('test offline mode')
  const createMitm = require('mitm')
  mitm ||= createMitm()

  mitm.on('connect', (socket: any, opts: any) => {
    const { host } = opts

    if (!LOCAL_HOSTS.includes(host as string)) {
      throw new Error(`Network request forbidden by testOffline(): ${host}`)
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
