module.exports = {
  prettierDirs: [
    'src,scripts,e2e,docs,cfg,resources,.github,public,static,components,content,layouts,pages,plugins,middleware,store,blocks',
  ],
  // ts,tsx,css,scss excluded, cause they need to run in special order (overlap between >1 tool):
  prettierExtensionsExclusive: 'js,jsx,json,md,graphql,yml,yaml,html',
  // everything that prettier supports:
  prettierExtensionsAll: 'ts,tsx,cts,mts,css,scss,js,jsx,cjs,mjs,json,md,graphql,yml,yaml,html,vue',
  eslintExtensions: 'ts,tsx,cts,mts,vue,html',
  stylelintExtensions: 'css,scss',
  lintExclude: ['./**/__exclude/**', './**/dist/**', './**/cache/**', './CHANGELOG.md'],
}
