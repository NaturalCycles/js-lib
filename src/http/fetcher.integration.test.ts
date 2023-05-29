import * as fs from 'node:fs'
import { Readable } from 'node:stream'
import { _pipeline } from '@naturalcycles/nodejs-lib'
import { expectTypeOf } from 'expect-type'
import { TimeoutError } from '../promise/pTimeout'
import { _stringifyAny } from '../string/stringifyAny'
import { tmpDir } from '../test/paths'
import { getFetcher } from './fetcher'

test('basic get', async () => {
  const fetcher = getFetcher({
    debug: true,
  })
    .onBeforeRequest(() => {
      console.log('before')
    })
    .onAfterResponse(res => {
      console.log('after')
      expect(res.ok).toBe(true)
      expect(res.err).toBeUndefined()
    })
  const r = await fetcher.get(`https://kg-backend3.appspot.com`, {
    searchParams: {
      a: 'b',
    },
  })
  // console.log(r)
  expect(r).toEqual({ ok: 1 })
})

test('post with error', async () => {
  const fetcher = getFetcher({
    debug: true,
  })
  const r = await fetcher.doFetch<number>({
    url: `https://kg-backend3.appspot.com`,
    method: 'POST',
  })
  expect(r.ok).toBe(false)
  expect(r.err!.message).toMatchInlineSnapshot(`"404 POST https://kg-backend3.appspot.com/"`)
  expect(r.err!.cause).toMatchInlineSnapshot(`
    {
      "data": {},
      "message": "404 Not Found: POST /",
      "name": "Error",
    }
  `)
  expect(_stringifyAny(r.err)).toMatchInlineSnapshot(`
    "HttpRequestError: 404 POST https://kg-backend3.appspot.com/
    Caused by: Error: 404 Not Found: POST /"
  `)

  if (r.ok) {
    expectTypeOf(r.err).toBeUndefined()
    expectTypeOf(r.body).toMatchTypeOf<number>()
  } else {
    expectTypeOf(r.err).toMatchTypeOf<Error>()
    expectTypeOf(r.body).toMatchTypeOf<number | undefined>()
  }
})

test('getReadableStream', async () => {
  const fetcher = getFetcher({
    debug: true,
  })

  const r = await fetcher.getReadableStream(`https://kg-backend3.appspot.com`)

  // https://css-tricks.com/web-streams-everywhere-and-fetch-for-node-js/
  // Example of Node.js streams interop
  await _pipeline([
    Readable.fromWeb(r as any), // `as any` because of typings conflict between Web and Node types
    fs.createWriteStream(`${tmpDir}/resp.txt`),
  ])
})

test('redirect: error', async () => {
  const fetcher = getFetcher({
    debug: true,
  })

  const r = await fetcher.doFetch({
    url: 'http://naturalcycles.com', // shall redirect to https
    redirect: 'error',
  })
  expect(r.ok).toBe(false)
  expect(_stringifyAny(r.err)).toMatchInlineSnapshot(`
    "HttpRequestError: GET http://naturalcycles.com/
    Caused by: TypeError: fetch failed
    Caused by: Error: unexpected redirect"
  `)
})

test('redirect: manual', async () => {
  const fetcher = getFetcher({
    debug: true,
  })

  const r = await fetcher.doFetch({
    url: 'http://naturalcycles.com', // shall redirect to https
    redirect: 'manual',
  })
  expect(r.ok).toBe(false)
  expect(_stringifyAny(r.err)).toMatchInlineSnapshot(`
    "HttpRequestError: 301 GET http://naturalcycles.com/
    Caused by: Error: Redirecting to https://naturalcycles.com/"
  `)
  expect(r.fetchResponse!.status).toBe(301)
  expect(r.fetchResponse!.headers.get('location')).toBe('https://naturalcycles.com/')
  expect(r.body).toBeUndefined()
})

test('timeout', async () => {
  const fetcher = getFetcher({
    debug: true,
    timeoutSeconds: 1,
    retry: { count: 0 },
  })

  const { err } = await fetcher.doFetch({ url: `https://kg-backend3.appspot.com/slow` })
  // console.log(err)
  expect(_stringifyAny(err)).toMatchInlineSnapshot(`
    "HttpRequestError: GET https://kg-backend3.appspot.com/slow
    Caused by: TimeoutError: request timed out after 1 sec"
  `)
  expect((err!.cause as Error)!.name).toBe(TimeoutError.name)
})
