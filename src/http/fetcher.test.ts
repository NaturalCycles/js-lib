import { AppError } from '../error/app.error'
import { _assertIsError, _assertIsErrorObject } from '../error/assert'
import { BackendErrorResponseObject } from '../error/error.model'
import { _errorToErrorObject } from '../error/error.util'
import { HttpRequestError } from '../error/httpRequestError'
import { commonLoggerNoop } from '../log/commonLogger'
import { _omit } from '../object/object.util'
import { _stringifyAny } from '../string/stringifyAny'
import { getFetcher } from './fetcher'

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
      },
      "logRequest": false,
      "logRequestBody": false,
      "logResponse": false,
      "logResponseBody": false,
      "logWithBaseUrl": true,
      "logWithSearchParams": true,
      "mode": "void",
      "retry": {
        "count": 2,
        "timeout": 1000,
        "timeoutMax": 30000,
        "timeoutMultiplier": 2,
      },
      "retry4xx": false,
      "retry5xx": true,
      "retryPost": false,
      "searchParams": {},
      "throwHttpErrors": true,
      "timeoutSeconds": 30,
      "url": "",
    }
  `)

  expect(fetcher.cfg.logger).toBe(console)
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
  })
  jest.spyOn(fetcher, 'callNativeFetch').mockImplementation(async () => {
    return new Response(
      JSON.stringify({
        error: _errorToErrorObject(
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

  const { err } = await fetcher.doFetch('some')

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

  const { err } = await fetcher.doFetch('some', {
    mode: 'json',
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
