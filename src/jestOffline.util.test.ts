import { getGot } from '@naturalcycles/nodejs-lib'
const got = getGot()

const detectLeaks = process.argv.some(a => a.includes('detectLeaks'))

test('should throw on network connections', async () => {
  if (detectLeaks) return // skip test on detectLeaks where jestOffline is disabled
  await expect(got('http://example.com')).rejects.toThrow('Network request forbidden')
})

test('should allow connection to local hosts', async () => {
  await got('http://127.0.0.1', { timeout: 1, retry: 0 }).catch(_ => {})
  await got('http://localhost', { timeout: 1, retry: 0 }).catch(_ => {})
}, 20_000)
