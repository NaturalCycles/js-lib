/**
 * @naturalcycles/dev-lib/cfg/eslint-vue.config.js
 */
module.exports = {
  extends: [
    './eslint.config.js',
    'plugin:vue/recommended',
    'prettier', // must go last
  ],
  env: {
    browser: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    extraFileExtensions: ['.vue'],
  },
  rules: {},
}
