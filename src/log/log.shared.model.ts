export enum LOG_LEVEL {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export type BasicLogFunction = (level: LOG_LEVEL, ...args: any[]) => void

export interface LogFunction {
  // convenience methods
  debug (...args: any[]): void
  info (...args: any[]): void
  warn (...args: any[]): void
  error (...args: any[]): void
  // convenience method for log.info()
  (...args: any[]): void
}
