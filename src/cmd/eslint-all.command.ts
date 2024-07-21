import fs from 'node:fs'
import { _since } from '@naturalcycles/js-lib'
import { boldGrey, dimGrey } from '@naturalcycles/nodejs-lib'
import yargs from 'yargs'
import { getTSConfigPathScripts, runESLintAsync } from '../util/lint.util'

/**
 * Runs `eslint` command for all predefined paths (e.g /src, /scripts, etc).
 */
export async function eslintAllCommand(): Promise<void> {
  const started = Date.now()
  const { ext, fix } = yargs.options({
    ext: {
      type: 'string',
      default: 'ts,tsx,vue',
    },
    fix: {
      type: 'boolean',
      default: true,
    },
  }).argv

  const extensions = ext.split(',')

  const eslintConfigPathRoot = ['./eslint.config.js'].find(p => fs.existsSync(p))
  const eslintConfigPathScripts = ['./scripts/eslint.config.js', './eslint.config.js'].find(p =>
    fs.existsSync(p),
  )
  const eslintConfigPathE2e = ['./e2e/eslint.config.js', './eslint.config.js'].find(p =>
    fs.existsSync(p),
  )
  const eslintConfigPathPlaywright = ['./playwright/eslint.config.js', './eslint.config.js'].find(
    p => fs.existsSync(p),
  )

  // const tsconfigPath = getTSConfigPath()
  const tsconfigPathScripts = getTSConfigPathScripts()
  const tsconfigPathE2e = `./e2e/tsconfig.json`
  const tsconfigPathPlaywright = `./playwright/tsconfig.json`

  // todo: run on other dirs too, e.g pages, components, layouts

  if (fix) {
    await Promise.all([
      // /src
      runESLintAsync(`./src`, eslintConfigPathRoot, undefined, extensions, fix),
      // /scripts
      runESLintAsync(`./scripts`, eslintConfigPathScripts, tsconfigPathScripts, undefined, fix),
      // /e2e
      runESLintAsync(`./e2e`, eslintConfigPathE2e, tsconfigPathE2e, undefined, fix),
      // /playwright // todo: remove after migration to e2e folder is completed
      runESLintAsync(
        `./playwright`,
        eslintConfigPathPlaywright,
        tsconfigPathPlaywright,
        undefined,
        fix,
      ),
    ])
  } else {
    // with no-fix - let's run serially
    // /src
    await runESLintAsync(`./src`, eslintConfigPathRoot, undefined, extensions, fix)
    // /scripts
    await runESLintAsync(`./scripts`, eslintConfigPathScripts, tsconfigPathScripts, undefined, fix)
    // /e2e
    await runESLintAsync(`./e2e`, eslintConfigPathE2e, tsconfigPathE2e, undefined, fix)
    // /e2e
    await runESLintAsync(
      `./playwright`,
      eslintConfigPathPlaywright,
      tsconfigPathPlaywright,
      undefined,
      fix,
    )
  }

  console.log(`${boldGrey('eslint-all')} ${dimGrey(`took ` + _since(started))}`)
}
