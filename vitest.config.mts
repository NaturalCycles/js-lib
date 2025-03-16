import { defineConfig } from 'vitest/config'
import { sharedConfig } from './cfg/vitest.config.mjs'

export default defineConfig({
  test: {
    ...sharedConfig,
  },
})
