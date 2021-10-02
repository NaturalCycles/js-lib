/**
 * @naturalcycles/dev-lib/cfg/eslint.config.js
 *
 * Shared eslint config.
 */
module.exports = {
  env: {
    es2020: true,
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
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended.ts
        'plugin:@typescript-eslint/recommended',
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/src/configs/recommended-requiring-type-checking.ts
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        // 'plugin:jest/recommended', // add manually if needed!
        // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/configs/recommended.js
        'plugin:unicorn/recommended',
        // https://github.com/import-js/eslint-plugin-import/blob/main/config/recommended.js
        // 'plugin:import/recommended',
        // https://github.com/import-js/eslint-plugin-import/blob/main/config/typescript.js
        // 'plugin:import/typescript',
        './eslint-rules.js',
        'prettier', // must be last! it only turns off eslint rules that conflict with prettier
      ],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.vue', '.html'],
      },
      plugins: [
        'jsdoc',
        'import',
        '@typescript-eslint',
        // https://github.com/sweepline/eslint-plugin-unused-imports
        'unused-imports',
        // 'jest', // add manually if needed!
        'unicorn',
      ],
    },
    {
      files: ['*.vue'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:unicorn/recommended',
        './eslint-rules.js',
        'plugin:vue/recommended',
        'prettier', // must go last
      ],
      env: {
        browser: true,
      },
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        project: ['tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 2020,
        extraFileExtensions: ['.vue'],
        // createDefaultProgram: true,
      },
    },
  ],
}
