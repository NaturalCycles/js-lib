import { commonLoggerCreate } from '@naturalcycles/js-lib'
import { inspectAny } from '@naturalcycles/nodejs-lib'

export function silentConsole(): void {
  console.log = () => {}
  console.debug = () => {}
  console.info = () => {}
  console.warn = () => {}
  console.error = () => {}
  console.time = () => {}
  console.table = () => {}
}

export const jestLogger = commonLoggerCreate((_level, args) => {
  if (process.env['JEST_SILENT']) return // no-op
  process.stdout.write(
    args
      .map(a =>
        inspectAny(a, {
          includeErrorStack: true,
        }),
      )
      .join(' ') + '\n',
  )
})

export const jestLog = jestLogger.log.bind(jestLogger)
