/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'SheetJS',
    image: '/img/users/sheetjs.png',
    infoLink: 'https://sheetjs.com',
    pinned: true,
  },
  {
    caption: 'BerryNodes LTD',
    image: '/img/users/berrynodes.svg',
    infoLink: 'https://www.berrynodes.com',
    pinned: true,
  },
  {
    caption: 'JustAnswer',
    image: '/img/users/justanswer.svg',
    infoLink: 'https://www.justanswer.com',
    pinned: true,
    width: 200,
  },
  {
    caption: 'Compass',
    image: '/img/users/compass.svg',
    infoLink: 'https://compass.com',
    pinned: true,
    width: 150,
  },
  {
    caption: 'Cycle.js',
    image: '/img/users/cyclejs.svg',
    infoLink: 'https://cycle.js.org/',
    pinned: true,
    width: 150,
  },
  {
    caption: 'Glitch',
    image: '/img/users/glitch.svg',
    infoLink: 'https://glitch.com/',
    pinned: true,
  },
  {
    caption: 'Microsoft',
    image: '/img/users/microsoft.svg',
    infoLink: 'https://microsoft.com/',
    pinned: true,
    width: 250,
  },
  {
    caption: 'Pingy',
    image: '/img/users/pingy.svg',
    infoLink: 'https://pin.gy/',
    pinned: true,
  },
  {
    caption: 'Rush',
    image: '/img/users/rush.svg',
    infoLink: 'https://rushjs.io/',
    pinned: true,
  },
  {
    caption: 'Enuma Technologies',
    image: '/img/users/enuma.svg',
    infoLink: 'https://enuma.io/',
    pinned: true,
    width: 250,
  },
  {
    caption: 'OAX Foundation',
    image: '/img/users/oax.svg',
    infoLink: 'https://www.oax.org/',
    pinned: true,
  },
  {
    caption: 'Panascais',
    image: '/img/users/panascais.svg',
    infoLink: 'https://panascais.net/',
    pinned: true,
    width: 250,
  },
  {
    caption: 'SwissDev Jobs',
    image: '/img/users/swissdev-javascript-jobs.svg',
    infoLink: 'https://swissdevjobs.ch/jobs/JavaScript/All/',
    pinned: true,
    width: 200,
  },
  {
    caption: 'Tokopedia',
    image: '/img/users/tokopedia.svg',
    infoLink: 'https://www.tokopedia.com/',
    pinned: true,
    width: 200,
  },
  {
    caption: 'Tradie Training',
    image: '/img/users/tradie-training.png',
    infoLink: 'https://tt.edu.au/',
    pinned: true,
  },
  {
    caption: 'Telia Company',
    image: '/img/users/telia.png',
    infoLink: 'https://www.telia.se/',
    pinned: true,
  },
  {
    caption: 'TakeShape',
    image: '/img/users/takeshape.svg',
    infoLink: 'https://www.takeshape.io/',
    pinned: true,
    width: 290,
  },
  {
    caption: 'Kretes',
    image: '/img/users/kretes.svg',
    infoLink: 'https://kretes.dev',
    pinned: true,
    width: 150,
  },
  {
    caption: 'tinyhttp',
    image: '/img/users/tinyhttp.svg',
    infoLink: 'https://tinyhttp.v1rtl.site',
    pinned: true,
    width: 180
  },
  {
    caption: 'Secure Code Warrior',
    image: 'https://media.securecodewarrior.com/images/current_logo_v.png',
    infoLink: 'https://securecodewarrior.com/',
    pinned: true,
    width: 200
  },
  {
    caption: 'Jublia',
    image: '/img/users/jublia.png',
    infoLink: 'https://jublia.com/',
    pinned: true,
    width: 200,
  },
];

const siteConfig = {
  title: 'pnpm' /* title for your website */,
  tagline: 'Fast, disk space efficient package manager',
  url: 'https://pnpm.js.org' /* your website url */,
  baseUrl: '/' /* base url for your project */,
  projectName: 'pnpm-site',
  headerLinks: [
    {doc: 'motivation', label: 'Docs'},
    {doc: 'faq', label: 'FAQ'},
    { search: true },
    {blog: true, label: 'Blog'},
  ],
  algolia: {
    apiKey: '802b1d6ee5450a4296581a8e14aff417',
    indexName: 'pnpm',
    algoliaOptions: {
      facetFilters: [ "language:LANGUAGE", "version:VERSION" ]
    }
  },
  users,
  /* path to images for header/footer */
  headerIcon: 'img/pnpm-no-name-with-frame.svg',
  // headerIcon: 'img/pnpm-light-no-name.svg',
  footerIcon: 'img/pnpm-light.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#f69220',
    secondaryColor: '#f9ad00',
  },
  cleanUrl: true,
  docsUrl: '',
  docsSideNavCollapsible: true,
  /* custom fonts for website */
  /*fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },*/
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright:
    'Copyright © ' +
    new Date().getFullYear() +
    ' contributors of pnpm',
  cname: 'pnpm.js.org' /* your website url */,
  organizationName: 'pnpm', // or set an env variable ORGANIZATION_NAME
  projectName: 'pnpm.github.io', // or set an env variable PROJECT_NAME
  editUrl: 'https://github.com/pnpm/pnpm.github.io/edit/source/docs/',
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/pnpm/pnpm',
  /* On page navigation for the current documentation page */
  onPageNav: 'separate',
  gaTrackingId: 'UA-91385296-1',
  translationRecruitingLink: 'https://crowdin.com/project/pnpm',
  ogImage: 'img/ogimage.png',
  twitterImage: 'img/ogimage.png',
};

module.exports = siteConfig;
