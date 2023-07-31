/**
 * @naturalcycles/dev-lib/cfg/eslint-vue2.config.js
 */

module.exports = {
  overrides: [
    {
      files: ['*.vue'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
        'plugin:unicorn/recommended',
        'plugin:vue/recommended',
        './eslint-rules.js',
        './eslint-vue-rules.js',
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
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
      },
    },
  ],
}
