const LOCAL_HOSTS = ['localhost', '127.0.0.1']

/**
 * Based on: https://github.com/palmerj3/jest-offline/blob/master/index.js
 */
export function jestOffline (): void {
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
