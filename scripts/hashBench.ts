/*

yarn tsn hashBench

 */

import { runBenchScript } from '@naturalcycles/bench-lib'
import { md5 } from '@naturalcycles/nodejs-lib'
import CryptoJS from 'crypto-js'
import { _range, pMap, hashCode, hashCode64 } from '../src'
const crypto = require('node:crypto').webcrypto

const data = _range(100).map(n => ({
  id: `id_${n}`,
  s: String(n).repeat(n),
  odd: !!(n % 2),
}))

runBenchScript({
  fns: {
    hashCode: done => {
      const _r = data.map(obj => {
        return String(hashCode(JSON.stringify(obj)))
      })

      done.resolve()
    },
    // hashCodeHex: done => {
    //   const _r = data.map(obj => {
    //     return String(hashCode16(JSON.stringify(obj)))
    //   })
    //
    //   done.resolve()
    // },
    hashCodeBase64url: done => {
      const _r = data.map(obj => {
        return String(hashCode64(JSON.stringify(obj)))
      })

      done.resolve()
    },
    // hashCodeBase36: done => {
    //   const _r = data.map(obj => {
    //     return String(hashCode36(JSON.stringify(obj)))
    //   })
    //
    //   done.resolve()
    // },
    cryptojsmd5: done => {
      const _r = data.map(obj => {
        return CryptoJS.MD5(JSON.stringify(obj))
      })

      done.resolve()
    },
    subtleCryptoSha256: async done => {
      const _r: any[] = []

      await pMap(data, async item => {
        _r.push(await subtleCryptoSha256(JSON.stringify(item)))
      })

      done.resolve()
    },
    nodemd5: done => {
      const _r = data.map(obj => {
        return md5(JSON.stringify(obj))
      })

      done.resolve()
    },
  },
  runs: 2,
})

async function subtleCryptoSha256(s: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(s)
  const hash = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('') // convert bytes to hex string
  return hashHex
}
