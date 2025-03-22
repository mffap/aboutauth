// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
const rehypeExternalLinks =  require('rehype-external-links').default;
const github_organization = 'mffap'
const github_name = 'aboutauth'
const github_url = 'https://github.com/' + github_organization + '/' + github_name

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'About Auth',
  tagline: 'Learn about auth, secure your world.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://aboutauth.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: github_organization, // Usually your GitHub org/user name.
  projectName: github_name, // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    mermaid: true,
  },
  trailingSlash: true,
  themes: ['@docusaurus/theme-mermaid'],
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          exclude: ['**/drafts/**'],
          editUrl:
            github_url + '/tree/main/packages/create-docusaurus/templates/shared/',
          rehypePlugins: [
            [
              rehypeExternalLinks,
              {
                target: '_blank',
                content(node) {
                  let url = new URL(node.properties.href)
                  return {type: 'text', value: ` (${url.hostname})` }
                },
                // content: [
                //   {type: 'text', value: ' ('},
                //   {type: 'text', value: ')'},
                // ]
              }
            ]
          ]
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            github_url + '/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        googleTagManager: {
          containerId: "GTM-NBSV4NXP"
        }
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'AboutAuth',
        logo: {
          alt: 'About Auth Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'learningSidebar',
            position: 'left',
            label: 'Learn',
          },
          {
            to: '/resources', 
            label: 'Resources', 
            position: 'left'
          },
          {
            to: '/top-identity-and-access-management-software', 
            label: 'Tools', 
            position: 'left'
          },
          // {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: github_url,
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            title: 'About Auth',
            items: [
              {
                label: 'Learn',
                to: '/docs/learn',
              },
              {
                label: 'Resources',
                to: '/resources',
              },
              {
                html: '<a href="#" class="cky-banner-element footer__link-item">Cookie Preferences</a>',
              },
            ],
          },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Stack Overflow',
          //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          //     },
          //     {
          //       label: 'Discord',
          //       href: 'https://discordapp.com/invite/docusaurus',
          //     },
          //     {
          //       label: 'Twitter',
          //       href: 'https://twitter.com/docusaurus',
          //     },
          //   ],
          // },
          {
            title: 'More',
            items: [
              // {
              //   label: 'Blog',
              //   to: '/blog',
              // },
              {
                label: 'GitHub',
                href: github_url,
              },
            ],
          },
        ],
        // copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {  
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['json'],
      },
      mermaid: {
        theme: {light: 'base', dark: 'dark'},
        options: {
          themeVariables: {
            primaryColor: '#FFFFFF',
            primaryBorderColor: '#D36915',
          }
        }
      }
    }),
};

export default config;
