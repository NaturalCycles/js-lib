import fs from 'node:fs'

const runsInIDE = doesItRunInIDE()
const testType = getTestType(runsInIDE)
const silent = shouldBeSilent(runsInIDE)
const setupFiles = getSetupFiles(testType)
const { include, exclude } = getIncludeAndExclude(testType)
const isCI = !!process.env['CI']
const junitReporterEnabled = isCI && testType !== 'manual'
process.env.TZ ||= 'UTC'

if (testType === 'unit') {
  process.env['APP_ENV'] = process.env['APP_ENV'] || 'test'
}

if (silent) {
  process.env['TEST_SILENT'] = 'true'
}

console.log('shared vitest config', { testType, silent, isCI, runsInIDE, include, exclude })

/**
 * Shared config for Vitest.
 */
export const sharedConfig = {
  watch: false,
  // dir: 'src',
  restoreMocks: true,
  silent,
  setupFiles,
  logHeapUsage: true,
  testTimeout: 60_000,
  sequence: {
    // todo: make it sort alphabetically
  },
  include,
  exclude,
  reporters: [
    'default',
    junitReporterEnabled && [
      'junit',
      {
        suiteName: `${testType} tests`,
        // classNameTemplate: '{filename} - {classname}',
      },
    ],
  ].filter(Boolean),
  // outputFile location is specified for compatibility with the previous jest config
  outputFile: junitReporterEnabled ? `./tmp/jest/${testType}.xml` : undefined,
  coverage: {
    enabled: isCI && testType === 'unit',
    reporter: ['html', 'lcov', 'json', 'json-summary',  !isCI && 'text'].filter(Boolean),
    include: ['src/**/*.{ts,tsx}'],
    exclude: [
      '**/__exclude/**',
      'scripts/**',
      'public/**',
      'src/index.*',
      'src/test/**',
      'src/typings/**',
      'src/{env,environment,environments}/**',
      'src/bin/**',
      'src/vendor/**',
      '**/*.test.*',
      '**/*.script.*',
      '**/*.module.*',
      '**/*.mock.*',
      '**/*.page.*',
      '**/*.component.*',
      '**/*.modal.*',
    ],
  },
}

function doesItRunInIDE() {
  return process.argv.some(
    a => a === '--runTestsByPath' || a.includes('IDEA') || a.includes('Visual Studio'),
  )
}

function getTestType(runsInIDE) {
  if (runsInIDE) {
    if (process.argv.some(a => a.endsWith('.integration.test.ts'))) {
      return 'integration'
    }
    if (process.argv.some(a => a.endsWith('.manual.test.ts'))) {
      return 'manual'
    }
  }

  return process.env['TEST_TYPE'] || 'unit'
}

function shouldBeSilent(runsInIDE) {
  if (runsInIDE) {
    return false
  }
  return isRunningAllTests()
}

/**
 * Detects if vitest is run with all tests, or with selected individual tests.
 */
function isRunningAllTests() {
  let vitestArg = false
  let hasPositionalArgs = false
  process.argv.forEach(a => {
    if (a.includes('.bin/vitest')) {
      vitestArg = true
      return
    }
    if (!vitestArg) return
    if (!a.startsWith('-')) {
      hasPositionalArgs = true
    }
  })
  // console.log({vitestArg, hasPositionalArgs}, process.argv)

  return !hasPositionalArgs
}

function getSetupFiles(testType) {
  // Set 'setupFiles' only if setup files exist
  const setupFiles = []
  if (fs.existsSync(`./src/test/setupVitest.ts`)) {
    setupFiles.push('./src/test/setupVitest.ts')
  }
  if (fs.existsSync(`./src/test/setupVitest.${testType}.ts`)) {
    setupFiles.push(`./src/test/setupVitest.${testType}.ts`)
  }
  return setupFiles
}

function getIncludeAndExclude(testType) {
  let include
  const exclude = ['**/__exclude/**']

  if (testType === 'integration') {
    include = ['{src,scripts}/**/*.integration.test.ts']
  } else if (testType === 'manual') {
    include = ['{src,scripts}/**/*.manual.test.ts']
  } else {
    // normal unit test
    include = ['{src,scripts}/**/*.test.ts']
    exclude.push('**/*.{integration,manual}.test.*')
  }

  return { include, exclude }
}
