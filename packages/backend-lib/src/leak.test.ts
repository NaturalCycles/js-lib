import { test } from 'vitest'

test('should not leak', async () => {
  await import('./index.js')
  await import('./testing/index.js')
})
