export const prettierPaths: string[] = [
  // Everything inside `/src`
  './src/**/*.{ts,css,scss,json,md,graphql,yml,yaml}',

  // Root
  './*.{js,json,md,yml,yaml}',

  // Doc
  './doc/*.md',
]

export const tslintPaths: string[] = ['./src/**/*.ts']

export const tslintExcludePaths: string[] = ['./src/@linked']
