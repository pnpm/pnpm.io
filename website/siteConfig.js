/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'Pingy',
    image: '/img/users/pingy.svg',
    infoLink: 'https://pin.gy/',
    pinned: true,
  },
];

const siteConfig = {
  title: 'pnpm' /* title for your website */,
  tagline: 'Fast, disk space efficient package manager',
  url: 'https://pnpm.js.org/' /* your website url */,
  baseUrl: '/' /* base url for your project */,
  projectName: 'pnpm-site',
  headerLinks: [
    {doc: 'intro', label: 'Docs'},
    {doc: 'faq', label: 'FAQ'},
    {page: 'help', label: 'Help'},
    {blog: true, label: 'Blog'},
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/pnpm-light-no-name.svg',
  footerIcon: 'img/pnpm-light.svg',
  favicon: 'img/favicon.png',
  /* colors for website */
  colors: {
    primaryColor: '#4e4e4e',
    secondaryColor: '#f9ad00',
    // primaryColor: '#2E8555',
    // secondaryColor: '#205C3B',
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
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default',
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/pnpm/pnpm',
  /* On page navigation for the current documentation page */
  // onPageNav: 'separate',
};

module.exports = siteConfig;
