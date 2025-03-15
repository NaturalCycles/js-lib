import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watch: false,
    dir: 'src',
    restoreMocks: true,
    silent: true,
    globals: true, // todo: migrate to false
    setupFiles: './src/test/setupVitest.ts',
    logHeapUsage: true,
    testTimeout: 60_000,
    // snapshotFormat: {},
    sequence: {
      // todo: make it sort alphabetically
    },
    include: ['**/*.test.ts'],
    exclude: ['**/*.{integration,manual}.test.*'],
  },
})
