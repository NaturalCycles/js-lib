import { pHang } from './pHang'

test('pHang', async () => {
  void pHang() // never resolves
})
