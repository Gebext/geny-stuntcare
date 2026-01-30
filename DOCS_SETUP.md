# GENY-StuntCare Dokumentasi Setup Guide

Dokumentasi aplikasi GENY-StuntCare menggunakan **Docusaurus 3**, sebuah static site generator yang powerful untuk technical documentation.

## 📋 Overview

```
Dockerized-Nestjs-Postgresql-Prisma-Nextjs-setup/
├── frontend/                  # Next.js Frontend Application
│   └── src/
│       └── features/landing/  # Landing page dengan link ke docs
│
└── docs-site/                 # Docusaurus Documentation Site (SEPARATE PROJECT)
    ├── docs/                  # Markdown documentation files
    ├── docusaurus.config.js   # Docusaurus configuration
    └── package.json           # Docusaurus dependencies
```

## 🚀 Setup & Run Dokumentasi

### Prerequisites

```bash
Node.js >= 16.14
npm or yarn
```

### 1. Install Dependencies

```bash
cd docs-site
npm install
```

### 2. Run Dokumentasi Locally

```bash
npm start
```

Akan terbuka di `http://localhost:3000`

### 3. Build untuk Production

```bash
npm run build
```

Hasil build tersimpan di `docs-site/build/`

## 📝 Struktur Dokumentasi

```
docs-site/docs/
├── intro.md              # Homepage (/)
├── user-guide.md         # Panduan Pengguna
├── features.md           # Fitur-Fitur Aplikasi
├── faq.md                # FAQ & Troubleshooting
└── troubleshooting.md    # Solusi Masalah Umum
```

## ✨ Features

✅ **Beautiful Documentation Site** - Modern, responsive, dark mode support  
✅ **Full Markdown Support** - Headers, tables, code blocks, admonitions  
✅ **Automatic Sidebar** - Auto-generated dari folder structure  
✅ **Search Functionality** - Built-in search untuk semua halaman  
✅ **Mobile Friendly** - Responsive design untuk semua devices  
✅ **SEO Optimized** - Meta tags, Open Graph, XML sitemap  
✅ **Easy Deployment** - Deploy ke Netlify, Vercel, GitHub Pages

## 🔗 Integration dengan Frontend

**Frontend Button Link:**

```tsx
<a href="https://docs.geny-stuntcare.id" target="_blank">
  Pelajari Lebih Lanjut
</a>
```

Button "Pelajari Lebih Lanjut" di halaman landing mengarah ke dokumentasi Docusaurus.

## 📚 Mengedit Dokumentasi

### Editing Markdown Files

1. Edit file di `docs-site/docs/*.md`
2. Docusaurus akan auto-reload saat development
3. Build ulang untuk production

### Menambah Halaman Baru

1. Buat file baru di `docs-site/docs/`
2. Tambah frontmatter:

```yaml
---
sidebar_position: 5
---
# Judul Halaman

Konten...
```

3. Auto-muncul di sidebar dan menu

### Markdown Features

**Admonitions (Info boxes):**

```markdown
:::info
Informasi penting
:::

:::warning
Peringatan
:::

:::danger
Bahaya
:::

:::tip
Tips berguna
:::
```

**Tabs:**

```markdown
import Tabs from '@theme/Tabs';
import TabsPanel from '@theme/TabsPanel';

<Tabs>
<TabsPanel value="tab1" label="Tab 1">
Konten tab 1
</TabsPanel>
<TabsPanel value="tab2" label="Tab 2">
Konten tab 2
</TabsPanel>
</Tabs>
```

## 🚢 Deployment

### Deploy ke Netlify

```bash
# Build locally
npm run build

# Upload build/ folder ke Netlify
```

### Deploy ke Vercel

```bash
vercel
```

### Deploy ke GitHub Pages

```bash
npm run deploy
```

## 📊 Konfigurasi

**Docusaurus Config:** `docs-site/docusaurus.config.js`

- Title, tagline, favicon
- URL dan base path
- Navbar items dan footer links
- Theme colors dan styling
- Dark mode support

**Sidebar Config:** `docs-site/sidebars.js`

- Auto-generate dari folder structure
- Customize sidebar order

**Styling:** `docs-site/src/css/custom.css`

- Custom CSS variables
- Override Infima theme

## 🔄 GitHub Integration

**Edit buttons** otomatis tersedia di setiap halaman:

```
Edit on GitHub → /edit/main/docs/...
```

Configure di `docusaurus.config.js`:

```js
editUrl: 'https://github.com/geny-stuntcare/docs/tree/main/',
```

## 📱 Running Both Frontend & Docs

**Terminal 1 - Frontend:**

```bash
cd frontend
npm run dev
# http://localhost:3000
```

**Terminal 2 - Docs:**

```bash
cd docs-site
npm start
# http://localhost:3000 (akan berbeda port jika frontend sudah jalan)
```

## 🎨 Customization

### Mengubah Colors

Edit `docs-site/src/css/custom.css`:

```css
:root {
  --ifm-color-primary: #2563eb;
  --ifm-color-primary-dark: #1d4ed8;
}
```

### Mengubah Navbar

Edit `docusaurus.config.js`:

```js
navbar: {
  title: 'GENY-StuntCare Docs',
  items: [
    // Add items here
  ]
}
```

### Mengubah Footer

Edit `docusaurus.config.js`:

```js
footer: {
  links: [
    // Add links here
  ];
}
```

## 📖 Referensi

- [Docusaurus Documentation](https://docusaurus.io/docs)
- [Markdown Features](https://docusaurus.io/docs/markdown-features)
- [Deployment Guide](https://docusaurus.io/docs/deployment)
- [Theming & Customization](https://docusaurus.io/docs/styling-layout)

## 🐛 Troubleshooting

**Build Error?**

```bash
# Clear cache
rm -rf node_modules build
npm install
npm run build
```

**Port sudah dipakai?**

```bash
npm start -- --port 3001
```

**Hot reload tidak bekerja?**

```bash
# Restart npm start
npm start
```

## 📞 Support

Untuk pertanyaan atau masalah dengan dokumentasi:

📧 Email: support@geny-stuntcare.id  
💬 Chat: https://geny-stuntcare.id/chat  
🐛 Issues: https://github.com/geny-stuntcare/docs/issues

---

**Created:** 30 Januari 2026  
**Documentation Version:** 1.0.0  
**Docusaurus Version:** 3.0.0
