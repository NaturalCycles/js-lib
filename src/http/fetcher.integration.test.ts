import { FetcherResponse, getFetcher } from './fetcher'

test('basic get', async () => {
  const fetcher = getFetcher({
    debug: true,
  })
    .onBeforeRequest(() => {
      console.log('before')
    })
    .onAfterResponse(() => {
      console.log('after')
    })
  const r = await fetcher.getJson(`https://kg-backend3.appspot.com`, {
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
  const r = await fetcher.postJson<FetcherResponse>(`https://kg-backend3.appspot.com`, {
    throwHttpErrors: false,
  })
  expect(r.err!.message).toMatchInlineSnapshot(`
    "404 POST https://kg-backend3.appspot.com
    404 Not Found: POST /"
  `)
})
