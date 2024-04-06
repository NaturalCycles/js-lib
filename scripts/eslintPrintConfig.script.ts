/*

yarn tsn eslintPrintConfig

This script allows to track changes in the final eslint config output,
like a "manual snapshot test".
Changes are visible in git diff every time they are observed.

 */

import { _substringAfter } from '@naturalcycles/js-lib'
import { execVoidCommandSync, fs2, runScript } from '@naturalcycles/nodejs-lib'
import { testDir } from '../src/cnst/paths.cnst'

runScript(async () => {
  const outputPath = `${testDir}/cfg/eslint.config.json`

  execVoidCommandSync(`eslint --print-config src/index.ts > ${outputPath}`, [], {
    shell: true,
    env: {
      ESLINT_USE_FLAT_CONFIG: 'false',
    },
  })

  const r = fs2.readJson<any>(outputPath)
  r.parser = _substringAfter(r.parser, 'dev-lib/')
  fs2.writeJson(outputPath, r, { spaces: 2 })
})
