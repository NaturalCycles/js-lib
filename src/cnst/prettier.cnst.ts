export const prettierExtensions = `css,scss,ts,js,json,md,graphql,yml,yaml,html`

export const prettierPaths: string[] = [
  // Everything inside `/src`
  `./{src,doc,cfg,.circleci}/**/*.{${prettierExtensions}}`,

  // Root
  `./*.{${prettierExtensions}},!./CHANGELOG.md`,
]

export const tslintPaths: string[] = ['./src/**/*.ts']

export const tslintExcludePaths: string[] = ['./src/@linked']
