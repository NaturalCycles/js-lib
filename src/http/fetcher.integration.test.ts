import { expectTypeOf } from 'expect-type'
import { getFetcher } from './fetcher'
import { FetcherResponse } from './fetcher.model'

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
  const r = await fetcher.post<FetcherResponse<number>>(`https://kg-backend3.appspot.com`, {
    throwHttpErrors: false,
  })
  expect(r.ok).toBe(false)
  expect(r.err!.message).toMatchInlineSnapshot(`
    "404 POST https://kg-backend3.appspot.com/
    404 Not Found: POST /"
  `)

  if (r.ok) {
    expectTypeOf(r.err).toBeUndefined()
    expectTypeOf(r.body).toMatchTypeOf<number>()
  } else {
    expectTypeOf(r.err).toMatchTypeOf<Error>()
    expectTypeOf(r.body).toMatchTypeOf<number | undefined>()
  }
})
