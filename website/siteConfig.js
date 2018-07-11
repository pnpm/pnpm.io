/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'Compass',
    image: '/img/users/compass.svg',
    infoLink: 'https://compass.com',
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
    {href: 'https://medium.com/pnpm', label: 'Blog'},
  ],
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
