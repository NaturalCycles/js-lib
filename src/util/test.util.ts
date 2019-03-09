export function silentConsole (): void {
  console.log = () => undefined
  console.debug = () => undefined
  console.info = () => undefined
  console.warn = () => undefined
  console.error = () => undefined
  console.time = () => undefined
  console.table = () => undefined
}
