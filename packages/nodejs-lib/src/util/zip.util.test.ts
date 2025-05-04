import { expect, test } from 'vitest'
import {
  deflateBuffer,
  deflateString,
  gunzipBuffer,
  gunzipToString,
  gzipBuffer,
  gzipString,
  inflateBuffer,
  inflateToString,
} from './zip.util.js'

test('deflate/inflate', async () => {
  const s = 'abcd1234$%^'

  // String
  let zippedBuf = await deflateString(s)
  const unzippedStr = await inflateToString(zippedBuf)
  expect(unzippedStr).toBe(s)

  const sBuf = Buffer.from(s)
  zippedBuf = await deflateBuffer(sBuf)
  const unzippedBuf = await inflateBuffer(zippedBuf)
  expect(unzippedBuf).toEqual(sBuf)
})

test('gzip/gunzip', async () => {
  const s = 'abcd1234$%^'

  // String
  let zippedBuf = await gzipString(s)
  const unzippedStr = await gunzipToString(zippedBuf)
  expect(unzippedStr).toBe(s)

  const sBuf = Buffer.from(s)
  zippedBuf = await gzipBuffer(sBuf)
  const unzippedBuf = await gunzipBuffer(zippedBuf)
  expect(unzippedBuf).toEqual(sBuf)
})

test('compatible with java impl', async () => {
  const s = 'aa'
  const zippedBuf = await deflateString(s)
  const bytes: number[] = []
  zippedBuf.forEach(c => bytes.push(c))
  // console.log(bytes)
  expect(bytes).toEqual([120, 156, 75, 76, 4, 0, 1, 37, 0, 195])
})

test('deflate vs gzip length', async () => {
  const s = 'a'
  const zipped = await deflateString(s)
  const gzipped = await gzipString(s)
  // console.log(zipped)
  // console.log(gzipped)
  // console.log(zipped.length, gzipped.length)
  expect(zipped).toHaveLength(9)
  expect(gzipped).toHaveLength(21)

  const longString = 'a'.repeat(100_000)
  const zippedLong = await deflateString(longString)
  const gzippedLong = await gzipString(longString)
  // console.log(zippedLong)
  // console.log(gzippedLong)
  // console.log(zippedLong.length, gzippedLong.length)
  expect(zippedLong).toHaveLength(121)
  expect(gzippedLong).toHaveLength(133)
})
