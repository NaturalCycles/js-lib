// Source: https://github.com/substack/deep-freeze/blob/master/index.js
export function deepFreeze (o: any): void {
  Object.freeze(o)

  Object.getOwnPropertyNames(o).forEach(prop => {
    if (
      o.hasOwnProperty(prop) &&
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop])
    }
  })

  return o
}

export function silentConsole (): void {
  console.log = () => undefined
  console.debug = () => undefined
  console.info = () => undefined
  console.warn = () => undefined
  console.error = () => undefined
  console.time = () => undefined
  console.table = () => undefined
}

export function runAllTests (): boolean {
  const args = process.argv.slice()
  const lastArg = args.filter(x => !x.startsWith('-')).pop()
  return (
    (lastArg && (lastArg.endsWith('/jest') || lastArg.endsWith('/jest-worker/build/child.js'))) ||
    false
  )
}

export function silentConsoleIfRunAll (): void {
  if (runAllTests()) silentConsole()
}
