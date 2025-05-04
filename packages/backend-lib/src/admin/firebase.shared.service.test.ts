import { expect, test } from 'vitest'
import { FirebaseSharedService } from './firebase.shared.service.js'

test('firebase shared service', async () => {
  const service = new FirebaseSharedService({
    apiKey: 'abc',
    authDomain: 'abc',
  })
  const admin = await service.admin()
  expect(typeof admin).toBe('object')
  const auth = admin.auth()
  expect(typeof auth.deleteUser).toBe('function')
})
