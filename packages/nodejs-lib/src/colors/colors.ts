import tty from 'node:tty'
import chalk from 'chalk'

/**
 * Based on: https://github.com/sindresorhus/yoctocolors/pull/5
 *
 * @experimental
 */
export const hasColors = !process.env['NO_COLOR'] && tty.WriteStream.prototype.hasColors()

// The point of re-exporting is:
// 1. Fix typings to allow to pass `number` (very common case)
// 2. Easier/shorter to import, rather than from 'chalk'
// export type ColorFn = (...args: (string | number)[]) => string

export const white = chalk.white
export const dimWhite = chalk.dim.white
export const boldWhite = chalk.bold.white
export const inverseWhite = chalk.inverse.white
export const grey = chalk.grey
export const dimGrey = chalk.dim.grey
export const boldGrey = chalk.bold.grey
export const yellow = chalk.yellow
export const dimYellow = chalk.dim.yellow
export const boldYellow = chalk.bold.yellow
export const inverseYellow = chalk.inverse.yellow
export const green = chalk.green
export const dimGreen = chalk.dim.green
export const boldGreen = chalk.bold.green
export const red = chalk.red
export const dimRed = chalk.dim.red
export const boldRed = chalk.bold.red
export const blue = chalk.blue
export const dimBlue = chalk.dim.blue
export const boldBlue = chalk.bold.blue
export const magenta = chalk.magenta
export const dimMagenta = chalk.dim.magenta
export const boldMagenta = chalk.bold.magenta
export const cyan = chalk.cyan
export const dimCyan = chalk.dim.cyan
export const boldCyan = chalk.bold.cyan
