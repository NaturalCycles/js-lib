/* eslint-disable no-bitwise */

/**
 * Returns a "deterministic Math.random() function"
 *
 * Based on: https://gist.github.com/mathiasbynens/5670917
 */
export function _createDeterministicRandom(): () => number {
  let seed = 0x2f6e2b1
  return function () {
    // Robert Jenkins’ 32 bit integer hash function
    seed = (seed + 0x7ed55d16 + (seed << 12)) & 0xffffffff
    seed = (seed ^ 0xc761c23c ^ (seed >>> 19)) & 0xffffffff
    seed = (seed + 0x165667b1 + (seed << 5)) & 0xffffffff
    seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff
    seed = (seed + 0xfd7046c5 + (seed << 3)) & 0xffffffff
    seed = (seed ^ 0xb55a4f09 ^ (seed >>> 16)) & 0xffffffff
    return (seed & 0xfffffff) / 0x10000000
  }
}
