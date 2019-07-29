/**
 * Based on: https://github.com/palmerj3/jest-offline/blob/master/index.js
 */
export function jestOffline (): void {
  console.log('jest offline mode')
  const Mitm = require('mitm')
  const mitm = Mitm()

  mitm.on('request', (req: any, res: any) => {
    res.end()
    throw new Error('Network requests forbidden in offline mode')
  })
}
