/**
 * @naturalcycles/dev-lib/cfg/eslint.config.js
 *
 * Shared eslint FLAT config.
 */

const globals = require('globals')
const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')

// detect if jest is installed
const hasJest = require('node:fs').existsSync('./node_modules/jest')
// console.log({ hasJest })

const defaultFiles = ['**/*.ts', '**/*.tsx']

module.exports = [
  {
    ...eslint.configs.recommended,
    files: defaultFiles,
  },
  // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/recommended-type-checked.ts
  ...tseslint.configs.recommendedTypeChecked.map(c => ({
    ...c,
    files: defaultFiles,
  })),
  // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/stylistic-type-checked.ts
  ...tseslint.configs.stylisticTypeChecked.map(c => ({
    ...c,
    files: defaultFiles,
  })),
  // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/configs/recommended.js
  {
    ...require('eslint-plugin-unicorn').configs['flat/recommended'],
    files: defaultFiles,
  },
  // https://eslint.vuejs.org/user-guide/#user-guide
  // ...require('eslint-plugin-vue').configs['flat/recommended'],
  ...require('eslint-plugin-vue').configs['flat/recommended'].map(c => ({
    ...c,
    files: defaultFiles,
  })),
  {
    files: defaultFiles,
    ...getConfig(),
  },
  {
    ignores: ['**/__exclude/**', '**/*.scss', '**/*.js'],
  },
].filter(Boolean)

function getConfig() {
  return {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'import-x': require('eslint-plugin-import-x'),
      // 'unused-imports': require('eslint-plugin-unused-imports'), // disabled in favor of biome rules
      'simple-import-sort': require('eslint-plugin-simple-import-sort'),
      jsdoc: require('eslint-plugin-jsdoc'),
      ...(hasJest ? { jest: require('eslint-plugin-jest') } : {}),
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        NodeJS: 'readonly',
        // testcafe
        fixture: 'readonly',
      },
      // parser: tseslint.parser,
      parserOptions: {
        project: 'tsconfig.json',
        parser: tseslint.parser,
        extraFileExtensions: ['.vue', '.html'],
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      ...require('./eslint-rules').rules,
      ...require('./eslint-vue-rules').rules,
      ...(hasJest ? require('./eslint-jest-rules').rules : {}),
      ...require('./eslint-prettier-rules').rules,
      ...require('./eslint-biome-rules').rules, // disable eslint rules already covered by biome
    },
  }
}
