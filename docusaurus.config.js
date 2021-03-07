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
    "users": [
      {
        "caption": "SheetJS",
        "image": "/img/users/sheetjs.png",
        "infoLink": "https://sheetjs.com",
        "pinned": true
      },
      {
        "caption": "JustAnswer",
        "image": "/img/users/justanswer.svg",
        "infoLink": "https://www.justanswer.com",
        "pinned": true,
        "width": 200
      },
      {
        "caption": "Compass",
        "image": "/img/users/compass.svg",
        "infoLink": "https://compass.com",
        "pinned": true,
        "width": 150
      },
      {
        "caption": "Cycle.js",
        "image": "/img/users/cyclejs.svg",
        "infoLink": "https://cycle.js.org/",
        "pinned": true,
        "width": 150
      },
      {
        "caption": "Glitch",
        "image": "/img/users/glitch.svg",
        "infoLink": "https://glitch.com/",
        "pinned": true
      },
      {
        "caption": "Microsoft",
        "image": "/img/users/microsoft.svg",
        "infoLink": "https://microsoft.com/",
        "pinned": true,
        "width": 250
      },
      {
        "caption": "Pingy",
        "image": "/img/users/pingy.svg",
        "infoLink": "https://pin.gy/",
        "pinned": true
      },
      {
        "caption": "Rush",
        "image": "/img/users/rush.svg",
        "infoLink": "https://rushjs.io/",
        "pinned": true
      },
      {
        "caption": "Enuma Technologies",
        "image": "/img/users/enuma.svg",
        "infoLink": "https://enuma.io/",
        "pinned": true,
        "width": 250
      },
      {
        "caption": "OAX Foundation",
        "image": "/img/users/oax.svg",
        "infoLink": "https://www.oax.org/",
        "pinned": true
      },
      {
        "caption": "Panascais",
        "image": "/img/users/panascais.svg",
        "infoLink": "https://panascais.net/",
        "pinned": true,
        "width": 250
      },
      {
        "caption": "SwissDev Jobs",
        "image": "/img/users/swissdev-javascript-jobs.svg",
        "infoLink": "https://swissdevjobs.ch/jobs/JavaScript/All/",
        "pinned": true,
        "width": 200
      },
      {
        "caption": "Tokopedia",
        "image": "/img/users/tokopedia.svg",
        "infoLink": "https://www.tokopedia.com/",
        "pinned": true,
        "width": 200
      },
      {
        "caption": "Tradie Training",
        "image": "/img/users/tradie-training.png",
        "infoLink": "https://tt.edu.au/",
        "pinned": true
      },
      {
        "caption": "Telia Company",
        "image": "/img/users/telia.png",
        "infoLink": "https://www.telia.se/",
        "pinned": true
      },
      {
        "caption": "TakeShape",
        "image": "/img/users/takeshape.svg",
        "infoLink": "https://www.takeshape.io/",
        "pinned": true,
        "width": 290
      },
      {
        "caption": "Kretes",
        "image": "/img/users/kretes.svg",
        "infoLink": "https://kretes.dev",
        "pinned": true,
        "width": 150
      },
      {
        "caption": "tinyhttp",
        "image": "/img/users/tinyhttp.svg",
        "infoLink": "https://tinyhttp.v1rtl.site",
        "pinned": true,
        "width": 180
      },
      {
        "caption": "Secure Code Warrior",
        "image": "https://media.securecodewarrior.com/images/current_logo_v.png",
        "infoLink": "https://securecodewarrior.com/",
        "pinned": true,
        "width": 200
      },
      {
        "caption": "Jublia",
        "image": "/img/users/jublia.png",
        "infoLink": "https://jublia.com/",
        "pinned": true,
        "width": 200
      },
      {
        "caption": "Wix",
        "image": "/img/users/wix.svg",
        "infoLink": "https://wix.com/",
        "pinned": true,
        "width": 200
      },
      {
        "caption": "art solution",
        "image": "https://artsolution.de/wp-content/uploads/2020/10/logo.jpg",
        "infoLink": "https://artsolution.de/",
        "pinned": true,
        "width": 250
      },
      {
        "caption": "Prezi",
        "image": "/img/users/prezi.svg",
        "infoLink": "https://prezi.com/",
        "pinned": true,
        "width": 200
      },
      {
        "caption": "ByteDance",
        "image": "/img/users/bytedance.png",
        "infoLink": "https://bytedance.com/",
        "pinned": true,
        "width": 250
      }
    ],
    "repoUrl": "https://github.com/pnpm/pnpm",
    "translationRecruitingLink": "https://crowdin.com/project/pnpm"
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
          "editUrl": "https://github.com/pnpm/pnpm.github.io/edit/source/docs/",
          "path": "./docs",
          "routeBasePath": "/",
          "sidebarPath": "./sidebars.json"
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
      ],
      "copyright": "Copyright © 2015-2021 contributors of pnpm",
      "logo": {
        "src": "img/pnpm-light.svg"
      }
    },
    "algolia": {
      "apiKey": "802b1d6ee5450a4296581a8e14aff417",
      "indexName": "pnpm",
      "algoliaOptions": {
        "facetFilters": [
          "language:LANGUAGE",
          "version:VERSION"
        ]
      }
    },
    "gtag": {
      "trackingID": "UA-91385296-1"
    }
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
    localeConfigs: {
      en: {
        label: 'English',
      },
    },
  }
}