export const prettierPaths: string[] = [
  // Everything inside `/src`
  './{src,doc,cfg,.circleci}/**/*.{ts,css,scss,js,json,md,graphql,yml,yaml}',

  // Root
  './*.{js,json,md,yml,yaml}',
]

export const tslintPaths: string[] = ['./src/**/*.ts']

export const tslintExcludePaths: string[] = ['./src/@linked']
