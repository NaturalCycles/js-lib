test('APP_ENV should be `test`', () => {
  expect(process.env['APP_ENV']).toBe('test')
})

test('TZ should be UTC', () => {
  expect(process.env.TZ).toBe('UTC')
})
