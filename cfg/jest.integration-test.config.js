/**
 * "Integration test" config for `jest24+`.
 * Extendable.
 */

const fs = require('fs-extra')
const cwd = process.cwd()

// Set 'setupFilesAfterEnv' only if it exists
const setupFilesAfterEnv = []
if (fs.pathExistsSync(`${cwd}/src/test/setupJest.integration.ts`)) {
  setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.integration.ts')
}

module.exports = {
  ...require('./jest.config'),
  testMatch: ['<rootDir>/src/test/integration/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/.*/__exclude/'],
  setupFilesAfterEnv,
  coverageDirectory: 'report/coverage-integration',
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        output: './report/jest/integration.xml',
        classNameTemplate: '{classname}-{title}',
        titleTemplate: '{classname}-{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ],
}
