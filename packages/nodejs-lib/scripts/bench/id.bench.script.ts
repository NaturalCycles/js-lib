/*

yarn tsx scripts/bench/id.bench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { stringId, stringIdBase62 } from '../../src/index.js'
import { nanoid } from '../../src/security/nanoid.js'

runBenchScript({
  fns: {
    nanoid: () => {
      const a = nanoid()
      const _b = a.repeat(2)
    },
    nanoid16: () => {
      const a = nanoid(16)
      const _b = a.repeat(2)
    },
    stringId: () => {
      const a = stringId()
      const _b = a.repeat(2)
    },
    stringIdBase62: () => {
      const a = stringIdBase62()
      const _b = a.repeat(2)
    },
  },
})
