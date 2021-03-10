const path = require('path');

const GITHUB_URL = 'https://github.com/pnpm/pnpm';
const SPONSOR_URL = 'https://opencollective.com/pnpm';
const TRANSLATE_URL = "https://crowdin.com/project/pnpm";

module.exports={
  "title": "pnpm",
  "tagline": "Fast, disk space efficient package manager",
  "url": "https://pnpm.js.org",
  "baseUrl": "/",
  "organizationName": "pnpm",
  "projectName": "pnpm.github.io",
  "scripts": [
    "https://buttons.github.io/buttons.js"
  ],
  "favicon": "img/favicon.png",
  "customFields": {
    "users": require('./users.json'),
    "repoUrl": GITHUB_URL,
    "translationRecruitingLink": TRANSLATE_URL,
  },
  "onBrokenLinks": "log",
  "onBrokenMarkdownLinks": "log",
  "presets": [
    [
      "@docusaurus/preset-classic",
      {
        "docs": {
          "showLastUpdateAuthor": true,
          "showLastUpdateTime": true,
          "editUrl": "https://github.com/pnpm/pnpm.github.io/edit/source/",
          "path": "./docs",
          "routeBasePath": "/",
          "sidebarPath": path.join(__dirname, "sidebars.json"),
        },
        "blog": {
          "path": "blog"
        },
        "theme": {
          "customCss": "../src/css/customTheme.css"
        }
      }
    ]
  ],
  "plugins": [
    [
      '@docusaurus/plugin-client-redirects',
      {
        createRedirects: (existingPath) => {
          const alternatives = []
          if (!existingPath.match(/^\/[a-z]{2}\//)) {
            alternatives.push(`/en${existingPath}`);
          }
          if (!existingPath.startsWith('/5.x/')) {
            alternatives.push(`/5.x${existingPath}`);
          }
          return alternatives;
        }
      }
    ]
  ],
  "themeConfig": {
    "prism": {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula'),
    },
    "navbar": {
      "title": "pnpm",
      "logo": {
        "src": "img/pnpm-no-name-with-frame.svg"
      },
      "items": [
        {
          "to": "motivation",
          "label": "Docs",
          "position": "left"
        },
        {
          "to": "blog",
          "label": "Blog",
          "position": "left"
        },
        {
          "to": "/faq",
          "label": "FAQ",
          "position": "left"
        },
        {
          type: 'docsVersionDropdown',
          "position": "right",
        },
        {
          type: 'localeDropdown',
          position: 'right',
          dropdownItemsAfter: [
            {
              to: 'https://crowdin.com/project/pnpm',
              label: 'Help Us Translate',
            },
          ],
        },
        {
          href: SPONSOR_URL,
          position: 'right',
          label: 'Sponsor Us'
        },
        {
          href: 'https://github.com/pnpm/pnpm',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    "image": "img/ogimage.png",
    "footer": {
      "links": [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'installation'
            },
            {
              label: 'pnpm CLI',
              to: 'pnpm-cli',
            },
            {
              label: 'Workspace',
              to: 'workspaces',
            },
            {
              label: '.npmrc',
              to: 'npmrc',
            },
          ]
        },
        {
          title: 'Community',
          items: [
            {
              label: 'User Showcase',
              to: 'users'
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/pnpm'
            },
            {
              label: 'Project Chat',
              href: 'https://bit.ly/pnpm-discord-invite',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/pnpmjs'
            }
          ]
        },
        {
          title: 'Contributing',
          items: [
            {
              label: 'GitHub',
              to: GITHUB_URL,
            },
            {
              label: 'Sponsor Us',
              to: SPONSOR_URL,
            },
            {
              label: 'Help Us Translate',
              to: TRANSLATE_URL,
            },
          ],
        },
      ],
      "copyright": "Copyright © 2015-2021 contributors of pnpm",
      "logo": {
        "src": "img/pnpm-light.svg"
      },
      "style": "dark",
    },
    "algolia": {
      "apiKey": "802b1d6ee5450a4296581a8e14aff417",
      "indexName": "pnpm",
      "contextualSearch": true,
    },
    "gtag": {
      trackingID: "UA-91385296-1",
      anonymizeIP: true,
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        label: 'English',
      },
      zh: {
        label: '中文',
      },
    },
  }
}
