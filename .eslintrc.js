module.exports = {
  root: true,
  extends: './node_modules/@naturalcycles/dev-lib/cfg/eslint.config.js',
  env: {
    browser: true,
  },
  rules: {
    'unicorn/no-array-reduce': 0,
  },
}
