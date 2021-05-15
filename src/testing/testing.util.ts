/**
 * Does Object.freeze recursively for given object.
 *
 * Based on: https://github.com/substack/deep-freeze/blob/master/index.js
 */
export function deepFreeze(o: any): void {
  Object.freeze(o)

  Object.getOwnPropertyNames(o).forEach(prop => {
    if (
      o.hasOwnProperty(prop) && // eslint-disable-line no-prototype-builtins
      o[prop] !== null &&
      (typeof o[prop] === 'object' || typeof o[prop] === 'function') &&
      !Object.isFrozen(o[prop])
    ) {
      deepFreeze(o[prop])
    }
  })
}

export function silentConsole(): void {
  console.log = () => {}
  console.debug = () => {}
  console.info = () => {}
  console.warn = () => {}
  console.error = () => {}
  console.time = () => {}
  console.table = () => {}
}
