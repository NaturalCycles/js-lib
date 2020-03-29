const LOCAL_HOSTS = ['localhost', '127.0.0.1']

const detectLeaks = process.argv.some(a => a.includes('detectLeaks'))

/**
 * Based on: https://github.com/palmerj3/jest-offline/blob/master/index.js
 */
export function jestOffline(): void {
  if (detectLeaks) {
    console.log('NOT applying jestOffline() when --detectLeaks is on')
    return
  }

  console.log('jest offline mode')
  const Mitm = require('mitm')
  const mitm = Mitm()

  mitm.on('connect', (socket: any, opts: any) => {
    const { host } = opts

    if (!LOCAL_HOSTS.includes(host)) {
      throw new Error(`Network request forbidden by jestOffline(): ${host}`)
    }

    socket.bypass()
  })
}
