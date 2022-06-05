// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function convertHrtime(hrtime: [number, number]) {
  const nanoseconds = hrtime[0] * 1e9 + hrtime[1]
  const milliseconds = nanoseconds / 1e6
  const seconds = nanoseconds / 1e9

  return {
    seconds,
    milliseconds,
    nanoseconds,
  }
}

export function timeSpan(): () => number {
  const start = process.hrtime()
  const end = (type: string) => convertHrtime(process.hrtime(start))[type]

  const ret: any = () => end('milliseconds')
  ret.rounded = () => Math.round(end('milliseconds'))
  ret.seconds = () => end('seconds')
  ret.nanoseconds = () => end('nanoseconds')

  return ret
}

/**
 * Strips away the Path from all files, keeping the filename.
 * Strips away line/column too, as it changes often.
 * To support deterministic tests.
 */
export function normalizeStack(s: string): string {
  return s.replace(/\(\/.*\/(.*):.*:.*\)/gm, '$1')
}

export function expectWithMessage(
  msg: string,
  expected: any,
  actual: any,
  expectedStr?: any,
  actualStr?: any,
): void {
  if (expected !== actual) {
    throw new Error(
      [
        msg,
        `Expected   : ${expected}`,
        `Actual     : ${actual}`,
        expectedStr && `ExpectedStr: ${expectedStr}`,
        actualStr && `ActualStr  : ${actualStr}`,
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }
}
