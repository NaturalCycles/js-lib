export const prettierExtensions = `css,scss,ts,tsx,js,jsx,json,md,graphql,yml,yaml,html,vue`

export const prettierPaths: string[] = [
  // Everything inside these folders
  `./{src,scripts,doc,cfg,.circleci}/**/*.{${prettierExtensions}}`,

  // Root
  `./*.{${prettierExtensions}},!./CHANGELOG.md`,
]

export const tslintPaths: string[] = ['./src/**/*.{ts,tsx}']
export const tslintExcludePaths: string[] = ['./**/@linked/**/*', './**/_exclude/**/*']

export const tslintScriptsPaths: string[] = ['./scripts/**/*.{ts,tsx}']
