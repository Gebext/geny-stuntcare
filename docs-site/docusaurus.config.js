import { themes as prismThemes } from "prism-react-renderer";

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "GENY-StuntCare",
  tagline: "Dokumentasi Lengkap Aplikasi Kesehatan Anak",
  favicon: "img/favicon.ico",

  url: "https://docs.geny-stuntcare.id",
  baseUrl: "/",

  organizationName: "geny-stuntcare",
  projectName: "docs",

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  i18n: {
    defaultLocale: "id",
    locales: ["id"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          sidebarPath: "./sidebars.js",
          editUrl: "https://github.com/geny-stuntcare/docs/tree/main/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "GENY-StuntCare Docs",
        logo: {
          alt: "GENY-StuntCare Logo",
          src: "img/logo.svg",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "docsSidebar",
            position: "left",
            label: "Dokumentasi",
          },
          {
            href: "https://github.com/geny-stuntcare",
            label: "GitHub",
            position: "right",
          },
          {
            href: "https://geny-stuntcare.id",
            label: "Aplikasi",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Dokumentasi",
            items: [
              {
                label: "Panduan Pengguna",
                to: "/user-guide",
              },
              {
                label: "Fitur Utama",
                to: "/features",
              },
              {
                label: "FAQ",
                to: "/faq",
              },
              {
                label: "Troubleshooting",
                to: "/troubleshooting",
              },
            ],
          },
          {
            title: "Komunitas",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/geny-stuntcare",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/geny_stuntcare",
              },
              {
                label: "Instagram",
                href: "https://instagram.com/geny.stuntcare",
              },
            ],
          },
          {
            title: "Support",
            items: [
              {
                label: "Email",
                href: "mailto:support@geny-stuntcare.id",
              },
              {
                label: "Chat",
                href: "https://geny-stuntcare.id/chat",
              },
              {
                label: "Aplikasi",
                href: "https://geny-stuntcare.id",
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} GENY-StuntCare. All rights reserved.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

module.exports = config;
