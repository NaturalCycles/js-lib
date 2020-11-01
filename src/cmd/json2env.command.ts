import * as yargs from 'yargs'
import { json2env } from '../util/env.util'

export function json2envCommand(): void {
  const { argv } = yargs.demandCommand(1).options({
    prefix: {
      type: 'string',
    },
    saveEnvFile: {
      type: 'boolean',
      desc: 'Save $JSON_FILE_NAME.sh file that exports json vars as environment vars',
      default: true,
    },
    bashEnv: {
      type: 'boolean',
      desc: 'Populate $BASH_ENV file if BASH_ENV env variable exists',
      default: true,
    },
    fail: {
      type: 'boolean',
      desc: 'Fail (exit status 1) on non-existing input file',
      default: true,
    },
    debug: {
      type: 'boolean',
    },
    silent: {
      type: 'boolean',
    },
  })

  const { _: args, prefix, saveEnvFile, bashEnv, fail, debug, silent } = argv
  if (debug) console.log({ argv })

  const [jsonPath] = args

  json2env({
    jsonPath,
    prefix,
    saveEnvFile,
    bashEnv,
    fail,
    debug,
    silent,
  })
}
