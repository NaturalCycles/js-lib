/**
 * Error that aggregates a number of other errors.
 * .errors contain raw original errors to be accessed if needed.
 * .results contain the results of some batch operation (if needed).
 */
export class AggregatedError<RESULT = any> extends Error {
  errors!: Error[]
  results!: RESULT[]

  constructor(errors: (Error | string)[], results: RESULT[] = []) {
    const mappedErrors = errors.map(e => {
      if (typeof e === 'string') return new Error(e)
      return e
    })

    const message = [
      `${errors.length} errors:`,
      ...mappedErrors.map((e, i) => `${i + 1}. ${e.message}`),
    ].join('\n')

    super(message)

    this.errors = mappedErrors
    this.results = results

    Object.defineProperty(this, 'name', {
      value: this.constructor.name,
      configurable: true,
    })

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    } else {
      Object.defineProperty(this, 'stack', {
        value: new Error().stack, // eslint-disable-line unicorn/error-message
        writable: true,
        configurable: true,
      })
    }
  }
}
