module.exports = {
  linters: {
    '**/*.{js,css,scss,json,md,graphql,yml,yaml}': ['prettier --write', 'git add'],
  },

  ignore: [],
}
