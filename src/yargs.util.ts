import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

/**
 * Quick yargs helper to make it work in esm.
 */
export const _yargs = yargs(hideBin(process.argv))
