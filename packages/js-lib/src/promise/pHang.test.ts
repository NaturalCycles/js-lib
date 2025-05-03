import { test } from 'vitest'
import { pHang } from './pHang.js'

test('pHang', async () => {
  void pHang() // never resolves
})
