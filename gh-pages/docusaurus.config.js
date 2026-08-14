// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'PIBIC',
  tagline: 'Documentação do meu projeto de Iniciação Científica',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // URL de produção do site (GitHub Pages)
  url: 'https://interactivedynamics.github.io',
  // baseUrl = '/<nome-do-repo>/' para GitHub Pages de projeto
  baseUrl: '/heitor-docs/',

  // Configuração de deploy no GitHub Pages.
  organizationName: 'InteractiveDynamics', // usuário/org do GitHub
  projectName: 'heitor-docs', // nome do repositório
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Metadados de idioma (define <html lang="pt-BR">)
  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Link "editar esta página" apontando pro seu repo
          editUrl:
            'https://github.com/HeitorM50/pibic-docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          blogTitle: 'Diário de bordo',
          blogDescription: 'Registro do andamento do PIBIC',
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/HeitorM50/pibic-docs/tree/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: [
            './src/css/custom.css',
            './src/css/dossie.css',
            './src/css/roadmap.css',
            './src/css/tecnica.css',
            './src/css/multicorpo.css',
          ],
        },
      }),
    ],
  ],

  // Fontes do design system (Space Grotesk display, Inter body, JetBrains Mono dados)
  stylesheets: [
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap',
  ],
  headTags: [
    {
      tagName: 'link',
      attributes: {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Card social (opcional, troque a imagem quando quiser)
      image: 'img/docusaurus-social-card.jpg',
      // A estética é um painel escuro de telemetria — modo escuro fixo.
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'PIBIC',
        hideOnScroll: true,
        logo: {
          alt: 'Logo do projeto',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentação',
          },
          {to: '/docs/roadmaps', label: 'Sprints semanais', position: 'left'},
          {to: '/blog', label: 'Diário de bordo', position: 'left'},
          {
            href: 'https://github.com/HeitorM50/pibic-docs',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentação',
            items: [
              {
                label: 'Índice de frentes',
                to: '/docs/intro',
              },
              {
                label: 'Sprints semanais',
                to: '/docs/roadmaps',
              },
              {
                label: 'Estudos & notas',
                to: '/docs/notas/dossie-godot',
              },
              {
                label: 'Diário de bordo',
                to: '/blog',
              },
            ],
          },
          {
            title: 'Links',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/HeitorM50/pibic-docs',
              },
            ],
          },
        ],
        copyright: `PIBIC · Dinâmica veicular · ${new Date().getFullYear()} Heitor M.`,
      },
      prism: {
        theme: prismThemes.oneDark,
        darkTheme: prismThemes.oneDark,
      },
    }),
};

export default config;
