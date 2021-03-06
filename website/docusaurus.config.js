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
    "docsUrl": "",
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
          "path": "../docs",
          "sidebarPath": "../website/sidebars.json"
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
  "plugins": [],
  "themeConfig": {
    "navbar": {
      "title": "pnpm",
      "logo": {
        "src": "img/pnpm-no-name-with-frame.svg"
      },
      "items": [
        {
          "to": "docs/",
          "label": "Docs",
          "position": "left"
        },
        {
          "to": "docs/faq",
          "label": "FAQ",
          "position": "left"
        },
        {
          "label": "Version",
          "to": "docs",
          "position": "right",
          "items": [
            {
              "label": "5.18",
              "to": "docs/",
              "activeBaseRegex": "docs/(?!2|3.0.0|3.1.0|3.2|3.3|3.4|3.5|3.6|3.7|3.8|4.0|4.1|4.2|4.3|4.4|4.5|4.6|4.7|4.8|4.9|4.10|4.11|4.12|4.13|4.14|5.0|5.1|5.2|5.3|5.4|5.5|5.6|5.7|5.8|5.9|5.10|5.11|5.12|5.14|5.15|5.16|5.17|5.18|next)"
            },
            {
              "label": "5.17",
              "to": "docs/5.17/"
            },
            {
              "label": "5.16",
              "to": "docs/5.16/"
            },
            {
              "label": "5.15",
              "to": "docs/5.15/"
            },
            {
              "label": "5.14",
              "to": "docs/5.14/"
            },
            {
              "label": "5.12",
              "to": "docs/5.12/"
            },
            {
              "label": "5.11",
              "to": "docs/5.11/"
            },
            {
              "label": "5.10",
              "to": "docs/5.10/"
            },
            {
              "label": "5.9",
              "to": "docs/5.9/"
            },
            {
              "label": "5.8",
              "to": "docs/5.8/"
            },
            {
              "label": "5.7",
              "to": "docs/5.7/"
            },
            {
              "label": "5.6",
              "to": "docs/5.6/"
            },
            {
              "label": "5.5",
              "to": "docs/5.5/"
            },
            {
              "label": "5.4",
              "to": "docs/5.4/"
            },
            {
              "label": "5.3",
              "to": "docs/5.3/"
            },
            {
              "label": "5.2",
              "to": "docs/5.2/"
            },
            {
              "label": "5.1",
              "to": "docs/5.1/"
            },
            {
              "label": "5.0",
              "to": "docs/5.0/"
            },
            {
              "label": "4.14",
              "to": "docs/4.14/"
            },
            {
              "label": "4.13",
              "to": "docs/4.13/"
            },
            {
              "label": "4.12",
              "to": "docs/4.12/"
            },
            {
              "label": "4.11",
              "to": "docs/4.11/"
            },
            {
              "label": "4.10",
              "to": "docs/4.10/"
            },
            {
              "label": "4.9",
              "to": "docs/4.9/"
            },
            {
              "label": "4.8",
              "to": "docs/4.8/"
            },
            {
              "label": "4.7",
              "to": "docs/4.7/"
            },
            {
              "label": "4.6",
              "to": "docs/4.6/"
            },
            {
              "label": "4.5",
              "to": "docs/4.5/"
            },
            {
              "label": "4.4",
              "to": "docs/4.4/"
            },
            {
              "label": "4.3",
              "to": "docs/4.3/"
            },
            {
              "label": "4.2",
              "to": "docs/4.2/"
            },
            {
              "label": "4.1",
              "to": "docs/4.1/"
            },
            {
              "label": "4.0",
              "to": "docs/4.0/"
            },
            {
              "label": "3.8",
              "to": "docs/3.8/"
            },
            {
              "label": "3.7",
              "to": "docs/3.7/"
            },
            {
              "label": "3.6",
              "to": "docs/3.6/"
            },
            {
              "label": "3.5",
              "to": "docs/3.5/"
            },
            {
              "label": "3.4",
              "to": "docs/3.4/"
            },
            {
              "label": "3.3",
              "to": "docs/3.3/"
            },
            {
              "label": "3.2",
              "to": "docs/3.2/"
            },
            {
              "label": "3.1.0",
              "to": "docs/3.1.0/"
            },
            {
              "label": "3.0.0",
              "to": "docs/3.0.0/"
            },
            {
              "label": "2",
              "to": "docs/2/"
            },
            {
              "label": "Master/Unreleased",
              "to": "docs/next/",
              "activeBaseRegex": "docs/next/(?!support|team|resources)"
            }
          ]
        }
      ]
    },
    "image": "img/ogimage.png",
    "footer": {
      "links": [],
      "copyright": "Copyright © 2021 contributors of pnpm",
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
  }
}