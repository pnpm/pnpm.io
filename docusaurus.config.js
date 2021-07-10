const path = require('path');

const GITHUB_URL = 'https://github.com/pnpm/pnpm';
const SPONSOR_URL = 'https://opencollective.com/pnpm';
const TRANSLATE_URL = "https://crowdin.com/project/pnpm";
const CRYPTO_DONATIONS_HREF = '/crypto-donations';
const DEFAULT_LOCALE = 'en';
const LOCALE_FULL_CODE = {
  zh: 'zh-CN',
}

function makeEditUrl (locale, path1, path2) {
  // Link to Crowdin for non-English docs
  if (locale !== DEFAULT_LOCALE) {
    return `https://crowdin.com/project/pnpm/${LOCALE_FULL_CODE[locale] || locale}`;
  }
  // Link to Github for English docs
  return `https://github.com/pnpm/pnpm.github.io/edit/main/${path1}/${path2}`;
}

module.exports={
  "title": "pnpm",
  "tagline": "Fast, disk space efficient package manager",
  "url": "https://pnpm.io",
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
          editUrl: ({locale, versionDocsDirPath, docPath}) => makeEditUrl(locale, versionDocsDirPath, docPath),
          "path": "./docs",
          "routeBasePath": "/",
          "sidebarPath": path.join(__dirname, "sidebars.json"),
        },
        "blog": {
          "path": "blog",
          editUrl: ({locale, blogDirPath, blogPath}) => makeEditUrl(locale, blogDirPath, blogPath),
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
          "to": "/community",
          "label": "Community",
          "position": "left"
        },
        {
          "to": "/benchmarks",
          "label": "Benchmarks",
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
          label: '🧡 Sponsor Us',
          position: 'right',
          items: [
            {
              label: 'Open Collective',
              href: SPONSOR_URL,
            },
            {
              label: 'Crypto Donations',
              href: CRYPTO_DONATIONS_HREF,
            }
          ]
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
              href: 'https://r.pnpm.io/chat',
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
              href: GITHUB_URL,
            },
            {
              label: 'Sponsor Us on Open Collective',
              href: SPONSOR_URL,
            },
            {
              label: 'Crypto Donations',
              href: CRYPTO_DONATIONS_HREF,
            },
            {
              label: 'Help Us Translate',
              href: TRANSLATE_URL,
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
    defaultLocale: DEFAULT_LOCALE,
    locales: ['en', 'zh', 'es', 'fr', 'pt', 'ru', 'it', 'tr', 'hu'],
    localeConfigs: {
      en: { label: 'English' },
      es: { label: 'Español' },
      fr: { label: 'Français' },
      ru: { label: 'Русский' },
      zh: { label: '中文' },
      tr: { label: 'Türkçe' },
      hu: { label: 'Magyar' },
      pt: { label: 'Português Brasileiro' },
      it: { label: 'Italiano' },
    },
  },
}
