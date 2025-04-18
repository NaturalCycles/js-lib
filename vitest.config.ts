import { defineConfig } from 'vitest/config'
import { sharedConfig } from './cfg/vitest.config.js'

export default defineConfig({
  test: {
    ...sharedConfig,
  },
})
