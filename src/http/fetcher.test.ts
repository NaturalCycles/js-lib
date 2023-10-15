import { expectTypeOf } from 'expect-type'
import {
  AppError,
  ErrorObject,
  HttpRequestError,
  localTimeNow,
  pExpectedErrorString,
  UnexpectedPassError,
} from '..'
import { _range } from '../array/range'
import { _assert, _assertIsError, _assertIsErrorObject } from '../error/assert'
import { BackendErrorResponseObject } from '../error/error.model'
import { _errorLikeToErrorObject } from '../error/error.util'
import { commonLoggerNoop } from '../log/commonLogger'
import { _omit } from '../object/object.util'
import { _stringifyAny } from '../string/stringifyAny'
import { Fetcher, getFetcher } from './fetcher'
import { FetcherRequest } from './fetcher.model'

test('defaults', () => {
  const fetcher = getFetcher()
  expect(_omit(fetcher.cfg, ['logger'])).toMatchInlineSnapshot(`
    {
      "baseUrl": "",
      "debug": false,
      "hooks": {},
      "init": {
        "credentials": undefined,
        "headers": {
          "user-agent": "fetcher2",
        },
        "method": "GET",
        "redirect": undefined,
      },
      "inputUrl": "",
      "logRequest": false,
      "logRequestBody": false,
      "logResponse": false,
      "logResponseBody": false,
      "logWithBaseUrl": true,
      "logWithSearchParams": true,
      "responseType": "json",
      "retry": {
        "count": 2,
        "timeout": 1000,
        "timeoutMax": 30000,
        "timeoutMultiplier": 2,
      },
      "retry3xx": false,
      "retry4xx": false,
      "retry5xx": true,
      "retryPost": false,
      "searchParams": {},
      "throwHttpErrors": true,
      "timeoutSeconds": 30,
    }
  `)

  expect(fetcher.cfg.logger).toBe(console)

  const req: FetcherRequest = (fetcher as any).normalizeOptions({ url: 'some', logResponse: true })
  expect(req.logResponse).toBe(true)
  req.started = 1234

  expect(req).toMatchInlineSnapshot(`
    {
      "debug": false,
      "fullUrl": "some",
      "init": {
        "credentials": undefined,
        "headers": {
          "accept": "application/json",
          "user-agent": "fetcher2",
        },
        "method": "GET",
        "redirect": "follow",
      },
      "inputUrl": "some",
      "logRequest": false,
      "logRequestBody": false,
      "logResponse": true,
      "logResponseBody": false,
      "responseType": "json",
      "retry": {
        "count": 2,
        "timeout": 1000,
        "timeoutMax": 30000,
        "timeoutMultiplier": 2,
      },
      "retry4xx": false,
      "retry5xx": true,
      "retryPost": false,
      "started": 1234,
      "throwHttpErrors": true,
      "timeoutSeconds": 30,
      "url": "some",
    }
  `)
})

test('should not mutate console', () => {
  const consoleSpy = jest.spyOn(console, 'log')
  const logger = commonLoggerNoop

  const fetcher = getFetcher({
    logger,
  })
  expect(fetcher.cfg.logger).toBe(logger)

  // When bug existed on fetcher - it mutated console.log to the logger.log
  // So, it'll be called 0 times
  // Here we're expecting that it's called 1 time
  console.log('yo')
  expect(consoleSpy).toBeCalledTimes(1)
})

test('mocking fetch', async () => {
  const fetcher = getFetcher({
    retry: {
      count: 0,
    },
    logResponse: true,
  })
  expect(fetcher.cfg.logResponse).toBe(true)
  jest.spyOn(Fetcher, 'callNativeFetch').mockImplementation(async () => {
    return new Response(
      JSON.stringify({
        error: _errorLikeToErrorObject(
          new AppError('aya-baya', {
            some: 'key',
          }),
        ),
      } satisfies BackendErrorResponseObject),
      {
        status: 500,
      },
    )
  })

  const { err } = await fetcher.doFetch({ url: 'some' })

  _assertIsError(err, HttpRequestError)

  // This is how "default tooling" prints errors
  expect(String(err)).toMatchInlineSnapshot(`"HttpRequestError: 500 GET some"`)

  // This is how Jest prints errors
  expect(err).toMatchInlineSnapshot(`[HttpRequestError: 500 GET some]`)

  // This is how NC-ecosystem-aware consumer prints errors (e.g with Cause)
  expect(_stringifyAny(err)).toMatchInlineSnapshot(`
    "HttpRequestError: 500 GET some
    Caused by: AppError: aya-baya"
  `)
  err.data.requestDuration = 10 // mock stability
  expect(err.data).toMatchInlineSnapshot(`
    {
      "requestDuration": 10,
      "requestMethod": "GET",
      "requestSignature": "GET some",
      "requestUrl": "some",
      "responseStatusCode": 500,
    }
  `)

  _assertIsErrorObject(err.cause)

  delete err.cause.stack
  expect(err.cause).toMatchInlineSnapshot(`
    {
      "data": {
        "some": "key",
      },
      "message": "aya-baya",
      "name": "AppError",
    }
  `)
  expect(_stringifyAny(err.cause)).toMatchInlineSnapshot(`"AppError: aya-baya"`)

  const { response } = err.data
  _assert(response)
  expect(response.ok).toBe(false)
  expect(response.url).toMatchInlineSnapshot(`""`) // unclear why
  expect(response.status).toBe(500)
  expect(Object.fromEntries(response.headers)).toMatchInlineSnapshot(`
    {
      "content-type": "text/plain;charset=UTF-8",
    }
  `)
  expect(Object.getOwnPropertyDescriptor(err.data, 'response')).toMatchObject({
    configurable: true,
    writable: true,
    enumerable: false,
  })
})

test('fetchFn', async () => {
  const fetcher = getFetcher({
    retry: {
      count: 0,
    },
    fetchFn: async (url, _init) => {
      return new Response(JSON.stringify({ url }))
    },
  })

  const url = 'abc'
  const r = await fetcher.get(url)
  expect(r).toEqual({ url })
})

test('throwHttpErrors = false', async () => {
  const fetcher = getFetcher({
    retry: {
      count: 0,
    },
    throwHttpErrors: false,
  })

  const error: ErrorObject = {
    name: 'AppError',
    message: 'some',
    data: {},
  }

  jest.spyOn(Fetcher, 'callNativeFetch').mockResolvedValue(
    new Response(
      JSON.stringify({
        error,
      } satisfies BackendErrorResponseObject),
      { status: 500 },
    ),
  )

  const r = await fetcher.get('')
  expect(r).toEqual({ error })
})

test('json parse error', async () => {
  const fetcher = getFetcher({
    retry: {
      count: 0,
    },
  })
  jest.spyOn(Fetcher, 'callNativeFetch').mockResolvedValue(new Response('some text'))

  const { err } = await fetcher.doFetch({
    url: 'some',
  })
  _assertIsError(err)
  expect(String(err)).toMatchInlineSnapshot(`"HttpRequestError: GET some"`)
  _assertIsErrorObject(err.cause)
  delete err.cause.stack
  expect(err.cause).toMatchInlineSnapshot(`
    {
      "data": {
        "text": "some text",
      },
      "message": "Failed to parse: some text",
      "name": "JsonParseError",
    }
  `)

  expect(_stringifyAny(err)).toMatchInlineSnapshot(`
    "HttpRequestError: GET some
    Caused by: JsonParseError: Failed to parse: some text"
  `)
})

test('paginate', async () => {
  const fetcher = getFetcher({
    debug: true,
    logResponseBody: true,
  })

  const pageSize = 10
  jest.spyOn(Fetcher, 'callNativeFetch').mockImplementation(async url => {
    const u = new URL(url)
    const page = Number(u.searchParams.get('page'))
    if (page > pageSize) return new Response(JSON.stringify([]))
    return new Response(JSON.stringify(_range((page - 1) * pageSize, page * pageSize)))
  })

  const results: number[] = []

  // UPD: Pagination API was removed as "not ergonomic enough"
  // Use "while(true) loop" instead
  //
  // await fetcher.get<number[]>('https://a.com', {
  //   searchParams: {
  //     page: 1,
  //   },
  //   paginate: (res, opt) => {
  //     if (!res.body.length) return false // no more items
  //     results.push(...res.body)
  //
  //     opt.searchParams!['page']++
  //     return true
  //   },
  // })
  //
  // expect(results).toEqual(_range(0, pageSize * 10))

  // Alternative implementation without Pagination API (for comparison)
  let page = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const r = await fetcher.get<number[]>('https://a.com', {
      searchParams: {
        page,
      },
    })

    if (!r.length) break
    results.push(...r)
    page++
  }

  expect(results).toEqual(_range(0, pageSize * 10))
})

test('retryAfter', async () => {
  const fetcher = getFetcher({
    debug: true,
  })

  const badResponse = (): Response =>
    new Response('429 rate limited', {
      status: 429,
      headers: {
        'retry-after': '2',
      },
    })
  jest
    .spyOn(Fetcher, 'callNativeFetch')
    .mockResolvedValueOnce(badResponse())
    .mockResolvedValueOnce(badResponse())
    .mockResolvedValueOnce(new Response('ok'))

  const r = await fetcher.getText('')
  expect(r).toBe('ok')
})

test('retryAfter date', async () => {
  const fetcher = getFetcher({
    debug: true,
  })

  const badResponse = (): Response =>
    new Response('429 rate limited', {
      status: 429,
      headers: {
        'retry-after': localTimeNow().plus(2, 'second').getDate().toString(),
      },
    })

  jest
    .spyOn(Fetcher, 'callNativeFetch')
    .mockImplementationOnce(async () => badResponse())
    .mockImplementationOnce(async () => badResponse())
    .mockResolvedValueOnce(new Response('ok'))

  const r = await fetcher.getText('')
  expect(r).toBe('ok')
})

test('tryFetch', async () => {
  jest.spyOn(Fetcher, 'callNativeFetch').mockResolvedValue(
    new Response('bad', {
      status: 500,
    }),
  )

  const [err, data] = await getFetcher().tryFetch<{ ok: boolean }>({
    url: 'https://example.com',
    method: 'POST',
  })
  expectTypeOf(err).toEqualTypeOf<HttpRequestError | null>()
  expectTypeOf(data).toEqualTypeOf<{ ok: boolean } | null>()
  expect(err).toBeInstanceOf(HttpRequestError)

  if (err) {
    expectTypeOf(err).toEqualTypeOf<HttpRequestError>()
    expect(err.data.requestMethod).toBe('POST')
    expect(_stringifyAny(err)).toMatchInlineSnapshot(`
      "HttpRequestError: 500 POST https://example.com/
      Caused by: Error: bad"
    `)
  } else {
    expectTypeOf(data).toEqualTypeOf<{ ok: boolean }>()
  }

  jest
    .spyOn(Fetcher, 'callNativeFetch')
    .mockResolvedValue(new Response(JSON.stringify({ ok: true })))

  const [err2, data2] = await getFetcher().tryFetch<{ ok: boolean }>({ url: 'https://example.com' })
  if (err2) {
    expectTypeOf(err2).toEqualTypeOf<HttpRequestError>()
  } else {
    expectTypeOf(data2).toEqualTypeOf<{ ok: boolean }>()
    expect(data2).toEqual({ ok: true })
  }
})

test('should not mutate headers', async () => {
  const a: any[] = []
  jest.spyOn(Fetcher, 'callNativeFetch').mockImplementation(async (url, init) => {
    a.push(init.headers)
    return new Response(JSON.stringify({ ok: 1 }))
  })

  const fetcher = getFetcher()
  const headers = { a: 'a' }

  await fetcher.doFetch({
    url: 'https://example.com',
    headers,
  })

  await fetcher.doFetch({
    url: 'https://example.com',
  })

  expect(a.length).toBe(2)
  expect(a[0]).toMatchInlineSnapshot(`
    {
      "a": "a",
      "accept": "application/json",
      "user-agent": "fetcher2",
    }
  `)
  expect(a[1]).toMatchInlineSnapshot(`
    {
      "accept": "application/json",
      "user-agent": "fetcher2",
    }
  `)
  expect(a[0]).not.toBe(a[1])
})

test('fetcher response headers', async () => {
  const fetcher = getFetcher()

  jest.spyOn(Fetcher, 'callNativeFetch').mockResolvedValue(new Response(JSON.stringify({ ok: 1 })))

  const { fetchResponse } = await fetcher.doFetch({})
  expect(Object.fromEntries(fetchResponse!.headers)).toMatchInlineSnapshot(`
    {
      "content-type": "text/plain;charset=UTF-8",
    }
  `)
})

test('expectError', async () => {
  const fetcher = getFetcher({
    retry: {
      count: 0,
    },
  })

  // 1. Error should pass
  jest.spyOn(Fetcher, 'callNativeFetch').mockResolvedValue(
    new Response(
      JSON.stringify({
        error: {
          name: 'AppError',
          message: 'some',
          data: {},
        },
      } satisfies BackendErrorResponseObject),
      { status: 500 },
    ),
  )

  const err = await fetcher.expectError({ url: 'someUrl' })
  expect(_stringifyAny(err)).toMatchInlineSnapshot(`
    "HttpRequestError: 500 GET someUrl
    Caused by: AppError: some"
  `)

  // 2. Pass should throw
  jest
    .spyOn(Fetcher, 'callNativeFetch')
    .mockResolvedValue(new Response(JSON.stringify({ ok: true })))

  expect(
    await pExpectedErrorString(
      fetcher.expectError({
        url: 'some',
      }),
      UnexpectedPassError,
    ),
  ).toMatchInlineSnapshot(`"UnexpectedPassError: Fetch was expected to error"`)
})
