export function randomInt (minIncl: number, maxIncl: number): number {
  return Math.floor(Math.random() * (maxIncl - minIncl + 1) + minIncl)
}

export function inRange (x: number, start: number, end: number): boolean {
  if (end === undefined) {
    end = start
    start = 0
  }

  return x >= Math.min(start, end) && x <= Math.max(end, start)
}

export function convertHrtime (hrtime: [number, number]) {
  const nanoseconds = hrtime[0] * 1e9 + hrtime[1]
  const milliseconds = nanoseconds / 1e6
  const seconds = nanoseconds / 1e9

  return {
    seconds,
    milliseconds,
    nanoseconds,
  }
}

export function timeSpan (): () => number {
  const start = process.hrtime()
  const end = (type: string) => convertHrtime(process.hrtime(start))[type]

  const ret: any = () => end('milliseconds')
  ret.rounded = () => Math.round(end('milliseconds'))
  ret.seconds = () => end('seconds')
  ret.nanoseconds = () => end('nanoseconds')

  return ret
}
