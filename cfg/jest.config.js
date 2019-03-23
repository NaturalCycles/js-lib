/**
 * Default config for `jest24+`.
 * Extendable.
 */

const fs = require('fs-extra')
const cwd = process.cwd()

// Set 'setupFilesAfterEnv' only if it exists
const setupFilesAfterEnv = []
if (fs.pathExistsSync(`${cwd}/src/test/setupJest.ts`)) {
  setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.ts')
}

const transformIgnore = ['@naturalcycles']

module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  transformIgnorePatterns: [`node_modules/(?!${transformIgnore.join('|')})`],
  testMatch: ['<rootDir>/src/**/*.test.ts?(x)'],
  testPathIgnorePatterns: [
    '<rootDir>/.*/__exclude/',
    '<rootDir>/src/environments/',
    '<rootDir>/src/@linked/',
    '<rootDir>/scripts/',
    '<rootDir>/src/test/integration/',
    '<rootDir>/docker-build/',
    '<rootDir>/dist/',
  ],
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
      // skipBabel: false, // when set to 'true' it breaks code coverage
    },
  },
  testEnvironment: 'node',
  unmockedModulePathPatterns: [],
  setupFilesAfterEnv,
  coverageDirectory: 'report/coverage-unit',
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
