/**
 * @naturalcycles/dev-lib/cfg/eslint.config.js
 *
 * Shared eslint FLAT config.
 */

import globals from 'globals'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'
import eslintPluginVue from 'eslint-plugin-vue'
import eslintPluginImportX from 'eslint-plugin-import-x'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import eslintPluginJsdoc from 'eslint-plugin-jsdoc'
import eslintPluginStylistic from '@stylistic/eslint-plugin'
import eslintRules from './eslint-rules.js'
import eslintVueRules from './eslint-vue-rules.js'
import eslintPrettierRules from './eslint-prettier-rules.js'
import eslintBiomeRules from './eslint-biome-rules.js'

const defaultFiles = ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts']

export default [
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
    ...eslintPluginUnicorn.configs.recommended,
    files: defaultFiles,
  },
  // https://eslint.vuejs.org/user-guide/#user-guide
  // ...require('eslint-plugin-vue').configs['flat/recommended'],
  ...eslintPluginVue.configs['flat/recommended'].map(c => ({
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
      'import-x': eslintPluginImportX,
      // 'unused-imports': require('eslint-plugin-unused-imports'), // disabled in favor of biome rules
      'simple-import-sort': eslintPluginSimpleImportSort,
      jsdoc: eslintPluginJsdoc,
      '@stylistic': eslintPluginStylistic,
      // ...(hasJest ? { jest: require('eslint-plugin-jest') } : {}), // todo: eslint-plugin-vitest
    },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.browser,
        ...globals.node,
        // ...globals.jest,
        ...globals.vitest,
        NodeJS: 'readonly',
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
      ...eslintRules.rules,
      ...eslintVueRules.rules,
      // ...(hasJest ? require('./eslint-jest-rules').rules : {}), // todo: vitest-rules
      ...eslintPrettierRules.rules, // disable eslint rules already covered by prettier
      ...eslintBiomeRules.rules, // disable eslint rules already covered by biome
    },
  }
}
