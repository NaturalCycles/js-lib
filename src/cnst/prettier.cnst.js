module.exports.prettierPaths = [
  // Everything inside `/src`
  './src/**/*.{ts,css,scss,json,md,graphql,yml,yaml}',

  // Root
  './*.{js,json,md,yml,yaml}',

  // Doc
  './doc/*.md',
]

module.exports.tslintPaths = ['./src/**/*.ts']

module.exports.tslintExcludePaths = ['./src/@linked']
