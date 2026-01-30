# GENY-StuntCare Dokumentasi

Dokumentasi website untuk aplikasi GENY-StuntCare dibangun dengan [Docusaurus](https://docusaurus.io/), sebuah static site generator yang powerful.

## 🚀 Quick Start

### Prerequisites

- Node.js version 16.14 or higher
- npm atau yarn

### Installation

```bash
cd docs-site
npm install
```

### Menjalankan dokumentasi secara lokal

```bash
npm start
```

Website akan terbuka di `http://localhost:3000`

### Build dokumentasi

```bash
npm run build
```

Output akan tersimpan di folder `build/`

## 📁 Struktur Folder

```
docs-site/
├── docs/                    # Dokumentasi markdown files
│   ├── intro.md            # Halaman utama (/)
│   ├── user-guide.md       # Panduan pengguna
│   ├── features.md         # Fitur-fitur
│   ├── faq.md              # FAQ
│   └── troubleshooting.md  # Troubleshooting
├── src/
│   └── css/
│       └── custom.css      # Custom CSS
├── docusaurus.config.js    # Konfigurasi Docusaurus
├── sidebars.js             # Sidebar navigation
└── package.json            # Dependencies
```

## 📝 Mengedit Dokumentasi

Semua halaman dokumentasi ada di folder `docs/`. Setiap file `.md` adalah halaman yang berbeda.

### Format Frontmatter

Setiap markdown file harus memiliki frontmatter dengan format:

```yaml
---
sidebar_position: 1
slug: /
---
# Judul Halaman

Konten...
```

### Fitur Markdown yang Didukung

- **Headers**: `# H1`, `## H2`, `### H3`, etc.
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Lists**: `- item` atau `1. item`
- **Code**: `` `code` `` atau ` ```code``` `
- **Links**: `[text](url)`
- **Images**: `![alt](image.png)`

### Admonitions (Callout Boxes)

```markdown
:::info
Info message
:::

:::warning
Warning message
:::

:::danger
Danger message
:::

:::tip
Tip message
:::
```

### Tabs

```markdown
import Tabs from '@theme/Tabs';
import TabsPanel from '@theme/TabsPanel';

<Tabs>
<TabsPanel value="id-1" label="Tab 1">
Konten tab 1
</TabsPanel>

<TabsPanel value="id-2" label="Tab 2">
Konten tab 2
</TabsPanel>
</Tabs>
```

## 🌐 Deploy ke Production

### Deploy ke Netlify

```bash
npm run build
```

Upload folder `build/` ke Netlify

### Deploy ke GitHub Pages

```bash
npm run deploy
```

## 📚 Dokumentasi Lebih Lanjut

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Features](https://docusaurus.io/docs/markdown-features)
- [Deployment](https://docusaurus.io/docs/deployment)

## 🤝 Contributing

Untuk berkontribusi pada dokumentasi:

1. Fork repository
2. Buat branch baru (`git checkout -b feature/docs`)
3. Edit file markdown di folder `docs/`
4. Commit changes (`git commit -am 'Add documentation'`)
5. Push ke branch (`git push origin feature/docs`)
6. Open Pull Request

## 📄 License

© 2026 GENY-StuntCare. All rights reserved.
