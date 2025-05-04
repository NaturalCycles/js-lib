import { _stringify, getFetcher, pExpectedError } from '@naturalcycles/js-lib'
import { expect, test } from 'vitest'
const fetcher = getFetcher({
  retry: { count: 0 },
})

const detectLeaks = process.argv.some(a => a.includes('detectLeaks'))

test('should throw on network connections', async () => {
  if (detectLeaks) return // skip test on detectLeaks where testOffline is disabled

  const err = await pExpectedError(fetcher.get('http://example.com'))
  expect(_stringify(err)).toMatchInlineSnapshot(`
    "HttpRequestError: GET http://example.com/
    Caused by: TypeError: fetch failed
    Caused by: Error: Network request forbidden by testOffline(): example.com"
  `)
})

test('should allow connection to local hosts', async () => {
  await fetcher.get('http://localhost').catch(_ => {})
}, 20_000)
