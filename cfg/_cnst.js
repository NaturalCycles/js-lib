module.exports = {
  prettierDirs: [
    'src,scripts,e2e,docs,cfg,.circleci,.github,public,static,components,content,layouts,pages,plugins,middleware,store',
  ],
  // ts,tsx,css,scss excluded, cause they need to run in special order (overlap between >1 tool):
  prettierExtensionsExclusive: 'js,jsx,json,md,graphql,yml,yaml,html,vue',
  // everything that prettier supports:
  prettierExtensionsAll: 'ts,tsx,css,scss,js,jsx,json,md,graphql,yml,yaml,html,vue',
  stylelintExtensions: 'css,scss',
  lintExclude: ['./**/__exclude/**', './docs/.vuepress/dist/**', './CHANGELOG.md'],
}
