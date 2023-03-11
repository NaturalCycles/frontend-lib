import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/frontend-lib/',
  title: 'frontend-lib',
  description: 'NaturalCycles/frontend-lib: Standard library for Frontend applications',
  // ignoreDeadLinks: true,

  head: [
    // ['link', { rel: 'stylesheet', href: '/custom.css' }]
  ],

  themeConfig: {
    nav: [
      { text: 'Github', link: 'https://github.com/NaturalCycles/frontend-lib/' },
      { text: 'Changelog', link: 'https://github.com/NaturalCycles/frontend-lib/releases' },
    ],
    sidebar: [
      {
        // text: 'Intro',
        collapsible: true,
        items: [{ text: 'Intro', link: '/' }],
      },
      {
        text: 'Features',
        collapsible: true,
        items: [
          { text: 'loadScript', link: '/loadScript' },
          { text: 'TranslationService', link: '/translation' },
          { text: 'Analytics', link: '/analytics' },
          { text: 'AdminService', link: '/adminService' },
          { text: 'Image', link: '/image' },
        ],
      },
    ],
  },
})
