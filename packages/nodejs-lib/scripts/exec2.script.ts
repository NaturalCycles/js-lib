/*

yarn tsx scripts/exec2.script.ts

 */

import { runScript } from '../src/index.js'
import { exec2 } from '../src/util/exec2.js'

runScript(async () => {
  await exec2.spawnAsync('node', {
    args: ['scripts/dot.script.js', '--error'],
    // log: true,
    // shell: true,
    // forceColor: false,
    // passProcessEnv: true,
  })

  // const s = exec2.exec({
  //   cmd: 'node scripts/dot.script.js --error',
  //   log: true,
  // })
  // console.log(s)

  // exec2.spawn({
  //   cmd: 'git status',
  //   log: true,
  // })
  //
  // exec2.spawn({
  //   cmd: 'git stat',
  //   log: true,
  // })

  // const s = exec2.exec({
  //   cmd: 'git status',
  //   log: true,
  // })
  // const { stdout } = await exec2.spawnAsync('git status', {
  //   log: true,
  // })
  // console.log(stdout)
})
