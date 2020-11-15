module.exports = {
  title: 'js-lib',
  base: '/js-lib/',

  themeConfig: {
    // search: false,
    repo: 'NaturalCycles/js-lib',
    docsDir: 'docs',
    smoothScroll: true,
    nav: [],
    sidebar: {
      '/': [
        {
          // title: 'Menu',
          collapsable: false,
          children: [
            '',
            'promise',
            'object',
            'array',
            'string',
            'number',
            'math',
            'json',
            'time',
            'units',
            'decorators',
            'error',
            'types',
          ],
        },
      ],
    },
  },

  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
    [
      'vuepress-plugin-typescript',
      {
        tsLoaderOptions: {
          transpileOnly: true,
        },
      },
    ],
  ],
  evergreen: true,
}
