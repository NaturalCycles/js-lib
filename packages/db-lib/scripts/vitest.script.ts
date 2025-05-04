/*

yarn tsx scripts/vitest.script.ts

 */

import { fastGlob, fs2, runScript } from '@naturalcycles/nodejs-lib'
import { projectDir } from '../src/test/paths.cnst.js'

runScript(async () => {
  const files = fastGlob.sync(`${projectDir}/{src,scripts}/**/*.test.ts`)
  // console.log(files)

  files.forEach(filePath => {
    let s = fs2.readText(filePath)
    s = `import { describe, expect, test, vi, beforeEach, beforeAll } from 'vitest'\n\n` + s
    fs2.writeFile(filePath, s)
    console.log(`saved ${filePath}`)
  })
})
