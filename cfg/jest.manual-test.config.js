/**
 * "Manual test" config for jest.
 * Extendable.
 */

const fs = require('fs')
const cwd = process.cwd()

// Set 'setupFilesAfterEnv' only if it exists
const setupFilesAfterEnv = []
if (fs.existsSync(`${cwd}/src/test/setupJest.ts`)) {
  setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.ts')
}
if (fs.existsSync(`${cwd}/src/test/setupJest.manual.ts`)) {
  setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.manual.ts')
}

/** @typedef {import('ts-jest/dist/types')} */
module.exports = {
  ...require('./jest.config'),
  testMatch: ['<rootDir>/src/**/*.manual.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/.*/__exclude/'],
  setupFilesAfterEnv,
  // Should never need coverage or reporters, but anyway
  coverageDirectory: 'tmp/coverage-manual',
  reporters: ['default'],
}
