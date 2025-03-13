import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    dir: 'src',
    silent: true,
    globals: true, // todo: migrate to false
    setupFiles: './src/test/setupVitest.ts',
    logHeapUsage: true,
    // snapshotFormat: {},
    sequence: {
      // todo: make it sort alphabetically
    },
  },
})

