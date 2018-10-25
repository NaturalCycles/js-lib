module.exports = {
  linters: {
    ...require('./cfg/lint-staged.config').linters,
    './cfg/*.{js,json,md,yml,yaml}': ['prettier --write', 'git add'],
  },
}
