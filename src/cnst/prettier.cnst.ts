export const prettierPaths: string[] = [
  // Everything inside `/src`
  './{src,doc,.circleci}/**/*.{ts,css,scss,json,md,graphql,yml,yaml}',

  // Root
  './*.{js,json,md,yml,yaml}',
]

export const tslintPaths: string[] = ['./src/**/*.ts']

export const tslintExcludePaths: string[] = ['./src/@linked']
