import { commonLoggerNoop } from '../log/commonLogger'
import { _omit } from '../object/object.util'
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
