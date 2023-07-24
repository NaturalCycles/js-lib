import { _range } from '../array/range'
import { localTime } from '../datetime/localTime'
import { AppError } from '../error/app.error'
import { _assertIsError, _assertIsErrorObject } from '../error/assert'
import { BackendErrorResponseObject } from '../error/error.model'
import { _errorLikeToErrorObject } from '../error/error.util'
import { HttpRequestError } from '../error/httpRequestError'
import { commonLoggerNoop } from '../log/commonLogger'
import { _omit } from '../object/object.util'
import { _stringifyAny } from '../string/stringifyAny'
import { getFetcher } from './fetcher'
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
        "headers": {},
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
      "responseType": "void",
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
      "timeoutSeconds": 30,
    }
  `)

  expect(fetcher.cfg.logger).toBe(console)

  const req: FetcherRequest = (fetcher as any).normalizeOptions({ url: 'some', logResponse: true })
  expect(req.logResponse).toBe(true)
  req.started = 1234

  expect(req).toMatchInlineSnapshot(`
    {
      "fullUrl": "some",
      "init": {
        "credentials": undefined,
        "headers": {},
        "method": "GET",
        "redirect": "follow",
      },
      "inputUrl": "some",
      "logRequest": false,
      "logRequestBody": false,
      "logResponse": true,
      "logResponseBody": false,
      "responseType": "void",
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
  jest.spyOn(fetcher, 'callNativeFetch').mockImplementation(async () => {
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
})

test('json parse error', async () => {
  const fetcher = getFetcher({
    retry: {
      count: 0,
    },
  })
  jest.spyOn(fetcher, 'callNativeFetch').mockImplementation(async () => {
    return new Response('some text')
  })

  const { err } = await fetcher.doFetch({
    url: 'some',
    responseType: 'json',
  })
  _assertIsError(err)
  expect(String(err)).toMatchInlineSnapshot(`"HttpRequestError: 200 GET some"`)
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
    "HttpRequestError: 200 GET some
    Caused by: JsonParseError: Failed to parse: some text"
  `)
})

test('paginate', async () => {
  const fetcher = getFetcher({
    debug: true,
    logResponseBody: true,
  })

  const pageSize = 10
  jest.spyOn(fetcher, 'callNativeFetch').mockImplementation(async url => {
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

  let attempt = 0
  jest.spyOn(fetcher, 'callNativeFetch').mockImplementation(async () => {
    if (++attempt < 2) {
      return new Response('429 rate limited', {
        status: 429,
        headers: {
          'retry-after': '2',
        },
      })
    }
    return new Response('ok')
  })

  const r = await fetcher.getText('')
  expect(r).toBe('ok')
})

test('retryAfter date', async () => {
  const fetcher = getFetcher({
    debug: true,
  })

  let attempt = 0
  jest.spyOn(fetcher, 'callNativeFetch').mockImplementation(async () => {
    if (++attempt < 2) {
      return new Response('429 rate limited', {
        status: 429,
        headers: {
          'retry-after': localTime().add(2, 'second').getDate().toString(),
        },
      })
    }
    return new Response('ok')
  })

  const r = await fetcher.getText('')
  expect(r).toBe('ok')
})
