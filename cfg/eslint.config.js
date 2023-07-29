/**
 * @naturalcycles/dev-lib/cfg/eslint.config.js
 *
 * Shared eslint config.
 */

// detect if jest is installed
const hasJest = require('node:fs').existsSync('./node_modules/jest')
// console.log({hasJest})

module.exports = {
  env: {
    es2024: true,
    node: true,
    jest: true,
    // 'jest/globals': true,
  },
  globals: {
    NodeJS: 'readable',
    // testcafe
    fixture: 'readable',
  },
  ignorePatterns: ['**/__exclude/**'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: [
        'eslint:recommended',
        // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/recommended-type-checked.ts
        'plugin:@typescript-eslint/recommended-type-checked',
        // https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/stylistic-type-checked.ts
        'plugin:@typescript-eslint/stylistic-type-checked',
        // 'plugin:jest/recommended', // add manually if needed!
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/configs/recommended.js
        'plugin:unicorn/recommended',
        // https://github.com/import-js/eslint-plugin-import/blob/main/config/recommended.js
        // 'plugin:import/recommended',
        // https://github.com/import-js/eslint-plugin-import/blob/main/config/typescript.js
        // 'plugin:import/typescript',
        hasJest && './eslint-jest-rules.js',
        './eslint-rules.js',
        'prettier', // must be last! it only turns off eslint rules that conflict with prettier
      ].filter(Boolean),
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue', '.html'],
      },
      plugins: [
        'jsdoc',
        'import',
        '@typescript-eslint',
        // https://github.com/sweepline/eslint-plugin-unused-imports
        'unused-imports',
        hasJest && 'jest',
        'unicorn',
      ].filter(Boolean),
    },
  ],
}
