// prettier-ignore
module.exports = [
  ...require('./cfg/eslint.config'),
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': 2,
    },
  },
]
