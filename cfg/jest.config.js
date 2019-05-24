/**
 * Default config for `jest24+`.
 * Extendable.
 */

const runInIDE = process.argv.includes('--runTestsByPath')
const ideIntegrationTest = runInIDE && process.argv.some(a => a.includes('/src/test/integration/'))

const fs = require('fs-extra')
const cwd = process.cwd()

// Set 'setupFilesAfterEnv' only if it exists
const setupFilesAfterEnv = []
if (fs.pathExistsSync(`${cwd}/src/test/setupJest.ts`)) {
  setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.ts')
}

if (ideIntegrationTest) {
  if (fs.pathExistsSync(`${cwd}/src/test/setupJest.integration.ts`)) {
    setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.integration.ts')
  }
} else {
  if (fs.pathExistsSync(`${cwd}/src/test/setupJest.unit.ts`)) {
    setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.unit.ts')
  }
}

const transformIgnore = ['@naturalcycles']

const testPathIgnorePatterns = [
  '<rootDir>/.*/__exclude/',
  '<rootDir>/src/environments/',
  '<rootDir>/src/@linked/',
]

// console.log({argv: process.argv})

if (runInIDE) {
  console.log({ runInIDE, ideIntegrationTest })
  process.env.APP_ENV = process.env.APP_ENV || 'test'
  process.env.TZ = process.env.TZ || 'UTC'
} else {
  // This allows to run integration tests in IDE
  testPathIgnorePatterns.push('<rootDir>/src/test/integration/')
}

module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [`node_modules/(?!${transformIgnore.join('|')})`],
  testMatch: ['<rootDir>/src/**/*.test.ts?(x)', '<rootDir>/scripts/**/*.test.ts?(x)'],
  testPathIgnorePatterns,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],
  moduleNameMapper: {
    // should match aliases from tsconfig.json
    // as explained here: https://alexjoverm.github.io/2017/10/07/Enhance-Jest-configuration-with-Module-Aliases/
    '@src/(.*)$': '<rootDir>/src/$1',
    '@linked/(.*)$': '<rootDir>/src/@linked/$1',
  },
  skipNodeResolution: true,
  globals: {
    'ts-jest': {
      diagnostics: false,
      // skipBabel: false, // when set to 'true' it breaks code coverage
    },
  },
  testEnvironment: 'node',
  unmockedModulePathPatterns: [],
  setupFilesAfterEnv,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/__exclude/**',
    '!src/index.ts',
    '!src/@linked/**',
    '!@linked/**',
    '!src/test/**',
    '!src/typings/**',
    '!scripts/**',
    '!src/env/**',
    '!src/environment/**',
    '!src/environments/**',
    '!src/env/**',
    '!src/bin/**',
    '!public/**',
    '!**/*.module.ts',
    '!**/*.mock.ts',
    '!**/*.page.ts',
    '!**/*.component.ts',
  ],
  rootDir: cwd,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        output: './report/jest/unit.xml',
        classNameTemplate: '{classname}-{title}',
        titleTemplate: '{classname}-{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ],
}
