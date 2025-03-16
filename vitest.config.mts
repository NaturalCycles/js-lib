import { defineConfig } from 'vitest/config'
import { sharedConfig } from '@naturalcycles/dev-lib/cfg/vitest.config.mjs'

export default defineConfig({
  test: {
    ...sharedConfig,
  },
})
