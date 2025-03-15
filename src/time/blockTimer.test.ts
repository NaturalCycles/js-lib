import { test } from 'vitest'
import { _blockTimer } from './time.util'

test('_blockTimer', () => {
  using _timer = _blockTimer()
})
