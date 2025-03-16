import fs from 'node:fs'

let silent
let testType = process.env['TEST_TYPE'] || 'unit'

const runsInIDE = process.argv.some(
  a => a === '--runTestsByPath' || a.includes('IDEA') || a.includes('Visual Studio'),
)

if (runsInIDE) {
  silent = false

  if (process.argv.some(a => a.endsWith('.integration.test.ts'))) {
    testType = 'integration'
  } else if (process.argv.some(a => a.endsWith('.manual.test.ts'))) {
    testType = 'manual'
  }
} else {
  silent = isRunningAllTests()
}

const isCI = !!process.env['CI']
process.env.TZ = process.env.TZ || 'UTC'
if (testType === 'unit') {
  process.env['APP_ENV'] = process.env['APP_ENV'] || 'test'
}

// Set 'setupFiles' only if setup files exist
const setupFiles = []
if (fs.existsSync(`./src/test/setupVitest.ts`)) {
  setupFiles.push('./src/test/setupVitest.ts')
}
if (fs.existsSync(`./src/test/setupVitest.${testType}.ts`)) {
  setupFiles.push(`./src/test/setupVitest.${testType}.ts`)
}

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
  coverage: {
    enabled: isCI && testType === 'unit',
    reporter: ['html', 'lcov', 'json', !isCI && 'text'].filter(Boolean),
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

