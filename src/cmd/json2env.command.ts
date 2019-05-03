import * as fs from 'fs-extra'
import * as yargs from 'yargs'
import { objectToShellExport } from '..'

export async function json2envCommand (): Promise<void> {
  const { argv } = yargs.demandCommand(1).options({
    prefix: {
      type: 'string',
    },
    debug: {
      type: 'boolean',
    },
    silent: {
      type: 'boolean',
    },
  })

  const { _: args, prefix, debug, silent } = argv
  if (debug) console.log({ argv })

  const [jsonPath] = args

  if (!fs.existsSync(jsonPath)) {
    throw new Error(`Path doesn't exist: ${jsonPath}`)
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

    console.log(`BASH_ENV file appeded (${BASH_ENV})`)
  }
}
