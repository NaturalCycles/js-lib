/**
 * Does Object.freeze recursively for given object.
 *
 * Based on: https://github.com/substack/deep-freeze/blob/master/index.js
 */
export function deepFreeze(o: any): void {
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

export function silentConsole(): void {
  console.log = () => undefined
  console.debug = () => undefined
  console.info = () => undefined
  console.warn = () => undefined
  console.error = () => undefined
  console.time = () => undefined
  console.table = () => undefined
}
