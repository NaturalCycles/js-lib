test('should not leak', () => {
  require('.')
  require('./testing')
})

export {}
