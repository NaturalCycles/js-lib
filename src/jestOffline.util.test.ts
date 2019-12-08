import got from 'got'

test('should throw on network connections', async () => {
  await expect(got('http://example.com')).rejects.toThrow('Network request forbidden')
})

test('should allow connection to local hosts', async () => {
  await got('http://127.0.0.1', { timeout: 1 }).catch(_ignored => {})
  await got('http://localhost', { timeout: 1 }).catch(_ignored => {})
}, 20000)
