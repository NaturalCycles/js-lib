import { _stringifyAny, getFetcher, pExpectedError } from '@naturalcycles/js-lib'
import { getGot } from '@naturalcycles/nodejs-lib'
const got = getGot()
const fetcher = getFetcher({
  retry: { count: 0 },
})

const detectLeaks = process.argv.some(a => a.includes('detectLeaks'))

test('should throw on network connections', async () => {
  if (detectLeaks) return // skip test on detectLeaks where jestOffline is disabled
  await expect(got('http://example.com')).rejects.toThrow('Network request forbidden')

  const err = await pExpectedError(fetcher.get('http://example.com'))
  expect(_stringifyAny(err)).toMatchInlineSnapshot(`
    "HttpRequestError: GET http://example.com/
    Caused by: TypeError: fetch failed
    Caused by: Error: Network request forbidden by jestOffline(): example.com"
  `)
})

test('should allow connection to local hosts', async () => {
  await got('http://127.0.0.1', { timeout: 1, retry: 0 }).catch(_ => {})
  await got('http://localhost', { timeout: 1, retry: 0 }).catch(_ => {})

  await fetcher.get('http://localhost').catch(_ => {})
}, 20_000)
