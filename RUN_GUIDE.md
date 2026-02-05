# 🚀 Panduan Menjalankan Aplikasi

## Port Configuration

Aplikasi ini berjalan pada port yang berbeda untuk menghindari konflik:

| Aplikasi | Port | URL |
|----------|------|-----|
| Frontend (Next.js) | 3000 | http://localhost:3000 |
| Dokumentasi (Docusaurus) | 3001 | http://localhost:3001 |
| Backend (NestJS) | 3333 | http://localhost:3333 |

## Cara Menjalankan

### ✅ Terminal 1: Frontend
```bash
cd frontend
npm run dev
```
Akses di: **http://localhost:3000**

### ✅ Terminal 2: Dokumentasi
```bash
cd docs-site
npm run start
```
Akses di: **http://localhost:3001**

### ✅ Terminal 3: Backend (Optional)
```bash
cd backend
npm run start:dev
```
Akses di: **http://localhost:3333**

## 🔧 Troubleshooting

### Frontend masih membuka port lain?
- Matikan semua proses Node yang berjalan:
  ```bash
  pkill -f node
  ```
- Jalankan ulang: `npm run dev` di folder frontend

### Port sudah digunakan?
Gunakan command ini untuk menemukan process yang menggunakan port:
```bash
# Cek port 3000
lsof -i :3000

# Cek port 3001  
lsof -i :3001

# Kill process by PID
kill -9 <PID>
```

### Frontend crash atau auto-exit?
- Pastikan semua dependencies terinstall:
  ```bash
  npm install
  ```
- Clear cache Next.js:
  ```bash
  rm -rf .next
  npm run dev
  ```

## 📝 Catatan Penting

- **Frontend** sudah dikonfigurasi untuk berjalan di port **3000**
- **Docusaurus** sudah dikonfigurasi untuk berjalan di port **3001** (lihat `docs-site/package.json`)
- Tidak boleh ada dua aplikasi yang berjalan di port yang sama
- Pastikan open port 3000, 3001, dan 3333 (jika menggunakan backend)
