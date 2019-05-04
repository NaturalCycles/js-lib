import * as fs from 'fs-extra'
import * as yargs from 'yargs'
import { objectToShellExport } from '..'

export async function json2envCommand (): Promise<void> {
  const { argv } = yargs.demandCommand(1).options({
    prefix: {
      type: 'string',
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

  const { _: args, prefix, fail, debug, silent } = argv
  if (debug) console.log({ argv })

  const [jsonPath] = args

  if (!fs.existsSync(jsonPath)) {
    if (fail) {
      throw new Error(`Path doesn't exist: ${jsonPath}`)
    }

    if (!silent) {
      console.log(`json2env input file doesn't exist, skipping without error (${jsonPath})`)
    }
    return
  }

  // read file
  const json = await fs.readJson(jsonPath)

  const exportStr = objectToShellExport(json, prefix)
  if (debug) {
    console.log(json, exportStr)
  }

  const shPath = `${jsonPath}.sh`
  await fs.writeFile(shPath, exportStr)

  if (!silent) {
    console.log(`json2env created ${shPath}:`)
    console.log(exportStr)
  }

  const { BASH_ENV } = process.env
  if (BASH_ENV) {
    await fs.appendFile(BASH_ENV, exportStr + '\n')

    console.log(`BASH_ENV file appended (${BASH_ENV})`)
  }
}
