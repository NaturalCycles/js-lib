/**
 * Default config for jest.
 * Extendable.
 */

const runInIDE = process.argv.includes('--runTestsByPath')
const ideIntegrationTest = runInIDE && process.argv.some(a => a.endsWith('.integration.test.ts'))
const ideManualTest = runInIDE && process.argv.some(a => a.endsWith('.manual.test.ts'))

const fs = require('fs')
const cwd = process.cwd()

// Set 'setupFilesAfterEnv' only if it exists
const setupFilesAfterEnv = []
if (fs.existsSync(`${cwd}/src/test/setupJest.ts`)) {
  setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.ts')
}

if (ideIntegrationTest) {
  if (fs.existsSync(`${cwd}/src/test/setupJest.integration.ts`)) {
    setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.integration.ts')
  }
} else if (ideManualTest) {
  if (fs.existsSync(`${cwd}/src/test/setupJest.manual.ts`)) {
    setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.manual.ts')
  }
} else {
  if (fs.existsSync(`${cwd}/src/test/setupJest.unit.ts`)) {
    setupFilesAfterEnv.push('<rootDir>/src/test/setupJest.unit.ts')
  }
}

const testMatch = ['<rootDir>/src/**/*.test.ts?(x)']
const roots = ['<rootDir>/src']
const scriptDirExists = fs.existsSync(`${cwd}/scripts`)
if (scriptDirExists) {
  testMatch.push('<rootDir>/scripts/**/*.test.ts?(x)')
  roots.push('<rootDir>/scripts')
}

const testPathIgnorePatterns = ['<rootDir>/.*/__exclude/', '<rootDir>/src/environments/']

// console.log({argv: process.argv})

if (runInIDE) {
  console.log({ runInIDE, ideIntegrationTest, ideManualTest })
  process.env.APP_ENV = process.env.APP_ENV || 'test'
  process.env.TZ = process.env.TZ || 'UTC'
} else {
  // This allows to run integration/manual tests in IDE
  testPathIgnorePatterns.push('\\.integration\\.test\\.ts$', '\\.manual\\.test\\.ts$')
}

/** @typedef {import('ts-jest/dist/types')} */
module.exports = {
  transform: {
    // '^.+\\.js$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest',
    // example (experimental):
    // '^.+\\.ts$': '@naturalcycles/dev-lib/cfg/jest.esbuild.transformer.js',
  },
  transformIgnorePatterns: ['/node_modules/'], // Jest default value
  testMatch,
  roots,
  rootDir: cwd,
  testPathIgnorePatterns,
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'd.ts', 'json'],
  moduleNameMapper: {
    // should match aliases from tsconfig.json
    // as explained here: https://alexjoverm.github.io/2017/10/07/Enhance-Jest-configuration-with-Module-Aliases/
    '@src/(.*)$': '<rootDir>/src/$1',
  },
  skipNodeResolution: true,
  globals: {
    'ts-jest': {
      diagnostics: false,
      // compilerHost: true, // disabled, cause its effects are not detected/understood yet
      // incremental: true,
      isolatedModules: true, // faster when run without cache (e.g in CI), 50s vs 83s for NCBackend3 right now
      babelConfig: false, // https://kulshekhar.github.io/ts-jest/user/config/babelConfig
    },
  },
  testEnvironment: 'node',
  errorOnDeprecated: true,
  unmockedModulePathPatterns: [],
  setupFilesAfterEnv,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!**/__exclude/**',
    '!src/index.ts',
    '!src/test/**',
    '!src/typings/**',
    '!scripts/**',
    '!src/env/**',
    '!src/environment/**',
    '!src/environments/**',
    '!src/env/**',
    '!src/bin/**',
    '!src/vendor/**',
    '!public/**',
    '!**/*.test.ts',
    '!**/*.script.ts',
    '!**/*.module.ts',
    '!**/*.mock.ts',
    '!**/*.page.ts',
    '!**/*.component.ts',
    '!**/*.modal.ts',
  ],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        outputDirectory: './tmp/jest',
        outputName: 'unit.xml',
        suiteNameTemplate: '{filepath}',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
        ancestorSeparator: ' ',
      },
    ],
  ],
}
