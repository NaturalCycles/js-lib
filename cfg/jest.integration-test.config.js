/**
 * "Integration test" config for `jest24+`.
 * Extendable.
 */

const fs = require('fs')
const cwd = process.cwd()

// Set 'setupFilesAfterEnv' only if it exists
const setupFilesAfterEnv = []
if (fs.existsSync(`${cwd}/src/test/setupJest.ts`)) {
  setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.ts')
}
if (fs.existsSync(`${cwd}/src/test/setupJest.integration.ts`)) {
  setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.integration.ts')
}

module.exports = {
  ...require('./jest.config'),
  testMatch: ['<rootDir>/src/test/integration/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/.*/__exclude/'],
  setupFilesAfterEnv,
  coverageDirectory: 'tmp/coverage-integration',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        outputDirectory: './tmp/jest',
        outputName: 'integration.xml',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' ',
      },
    ],
  ],
}
