import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/js-lib/',
  title: 'js-lib',
  description:
    'NaturalCycles/js-lib: Standard library for universal (browser + Node.js) javascript',
  // ignoreDeadLinks: true,

  head: [
    // ['link', { rel: 'stylesheet', href: '/custom.css' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Github', link: 'https://github.com/NaturalCycles/js-lib/' },
      { text: 'Changelog', link: 'https://github.com/NaturalCycles/js-lib/releases' },
    ],
    sidebar: [
      {
        text: 'Intro',
        collapsed: false,
        items: [{ text: 'Intro', link: '/' }],
      },
      {
        text: 'Features',
        collapsed: false,
        items: [
          { text: 'Promise', link: '/promise' },
          { text: 'Object', link: '/object' },
          { text: 'Array', link: '/array' },
          { text: 'String', link: '/string' },
          { text: 'Number', link: '/number' },
          { text: 'Math', link: '/math' },
          { text: 'JSON', link: '/json' },
          { text: 'Date', link: '/date' },
          { text: 'Time', link: '/time' },
          { text: 'Units', link: '/units' },
          { text: 'Decorators', link: '/decorators' },
          { text: 'Error', link: '/error' },
          { text: 'Types', link: '/types' },
          { text: 'Lazy', link: '/lazy' },
          { text: 'Fetcher', link: '/fetcher' },
        ],
      },
    ],
  },
})
