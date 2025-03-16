import { defineConfig } from 'vitest/config'

const { CI } = process.env

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
    exclude: ['**/__exclude/**', '**/*.{integration,manual}.test.*'],
    coverage: {
      enabled: !!CI,
      reporter: ['text', 'html', 'lcov', 'json'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        '**/__exclude/**',
        'src/index.{ts,tsx}',
        'src/test/**',
        'src/typings/**',
        'scripts/**',
        'src/env/**',
        'src/environment/**',
        'src/environments/**',
        'src/env/**',
        'src/bin/**',
        'src/vendor/**',
        'public/**',
        '**/*.test.ts',
        '**/*.script.ts',
        '**/*.module.ts',
        '**/*.mock.ts',
        '**/*.page.{ts,tsx}',
        '**/*.component.{ts,tsx}',
        '**/*.modal.{ts,tsx}',
      ],
    },
  },
})
