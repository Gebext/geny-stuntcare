---
sidebar_position: 5
---

# Troubleshooting - Solusi Masalah Umum

Panduan untuk mengatasi masalah-masalah yang mungkin Anda alami saat menggunakan GENY-StuntCare.

## 📱 Masalah Login & Akun

### Tidak bisa login

**Gejala:** Muncul error "Username atau password salah"

**Solusi:**

1. Pastikan email Anda benar (perhatikan typo)
2. Pastikan CAPS LOCK tidak aktif
3. Coba "Lupa Password" untuk reset
4. Jika akun belum verifikasi, cek email verifikasi
5. Hubungi support jika masih error

---

### Email verifikasi tidak masuk

**Gejala:** Belum menerima email untuk verifikasi akun

**Solusi:**

1. Cek folder Spam/Junk email
2. Tunggu beberapa menit (email bisa delay)
3. Klik "Kirim Ulang Email Verifikasi"
4. Whitelist domain `noreply@geny-stuntcare.id`
5. Gunakan email lain jika email lama tidak bisa

---

### Akun terkunci setelah percobaan login berulang

**Gejala:** Muncul pesan "Akun terkunci untuk sementara"

**Solusi:**

1. Tunggu 30 menit sebelum coba login lagi
2. Reset password melalui "Lupa Password"
3. Hubungi support untuk unlock manual

---

## 📊 Masalah Input Data

### Data tidak tersimpan setelah diklik Simpan

**Gejala:** Klik Simpan tapi data tidak muncul di list

**Solusi:**

1. Periksa koneksi internet Anda
2. Tunggu loading selesai (jangan refresh)
3. Lihat pesan notifikasi di atas (ada error?)
4. Coba clear cache browser (Ctrl+Shift+Delete)
5. Coba input lagi dengan data baru

---

### Form error saat input data (field berubah merah)

**Gejala:** Field seperti "Berat Badan" atau "Tinggi" ditandai error

**Solusi:**

1. **Lihat pesan error** yang muncul di bawah field
2. **Periksa format data:**
   - Berat badan: gunakan angka + koma (misal: 12.5)
   - Tinggi: dalam cm (misal: 75)
   - Umur: dalam bulan lengkap
3. **Pastikan data masuk akal:**
   - Berat 150kg untuk bayi → tidak valid
   - Tinggi 200cm untuk umur 1 tahun → tidak valid

---

### Data duplikat (sama muncul berkali-kali)

**Gejala:** Satu pengukuran muncul 2-3x di riwayat

**Solusi:**

1. Refresh halaman (F5 atau Cmd+R)
2. Clear cache browser dan refresh
3. Logout dan login ulang
4. Hubungi support jika masih duplikat

---

## 📈 Masalah Grafik & Data Visualisasi

### Grafik tidak muncul / blank

**Gejala:** Area grafik kosong, tidak ada garis

**Solusi:**

1. Pastikan data minimal 2 pengukuran
2. Refresh halaman (F5)
3. Clear browser cache
4. Coba browser lain (Chrome, Firefox, Safari)
5. Hubungi support jika tetap blank

---

### Grafik tampilan aneh / garis naik-turun ekstrem

**Gejala:** Grafik tidak smooth, ada lonjakan tidak wajar

**Solusi:**

1. **Data mungkin salah input** - Cek ulang nilai pengukuran
2. Bandingkan dengan pencatatan manual Anda
3. Hubungi support untuk delete data yang error

---

## 🤖 Masalah AI & Rekomendasi

### Rekomendasi tidak muncul

**Gejala:** Halaman Rekomendasi kosong atau loading

**Solusi:**

1. Pastikan data anak sudah ada minimal 1 pengukuran
2. Tunggu 1-2 menit untuk AI process
3. Refresh halaman
4. Logout dan login ulang
5. Clear cache browser

---

### Rekomendasi berbeda dari dokter

**Gejala:** AI bilang risiko rendah tapi dokter bilang sebaliknya

**Solusi:**

1. **Rekomendasi AI bukan diagnosis medis** - Ikuti saran dokter
2. AI hanya berdasarkan data antropometri
3. Dokter mempertimbangkan faktor lain (kesehatan keseluruhan)
4. Beri feedback untuk improve AI

---

## 💬 Masalah Chat Support

### Chat tidak bisa dikirim

**Gejala:** Pesan tidak terkirim, ada error atau stuck

**Solusi:**

1. Periksa koneksi internet
2. Tunggu beberapa detik
3. Jangan kirim message duplikat
4. Refresh halaman dan coba lagi
5. Coba browser lain

---

### Tidak ada respons dari ahli

**Gejala:** Sudah chat tapi tidak ada jawaban

**Solusi:**

1. **Periksa jam operasional:**
   - Senin-Jumat: 08:00-18:00 WIB
   - Sabtu: 08:00-14:00 WIB
   - Minggu: Tutup
2. Chat pada jam kerja
3. Tunggu maksimal 2 jam untuk respons
4. Untuk kasus darurat: 112 atau RS terdekat

---

## 🌐 Masalah Koneksi & Performa

### Website/app tidak loading

**Gejala:**

- Halaman putih kosong
- Muncul error "Cannot reach server"
- Loading forever

**Solusi:**

1. **Periksa koneksi internet:**
   - Coba buka google.com
   - Restart router/WiFi
   - Gunakan mobile data jika WiFi error
2. **Restart device:**
   - Close aplikasi/browser
   - Tunggu 10 detik
   - Buka ulang
3. **Clear cache & cookies:**
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
4. **Coba browser berbeda** (Chrome, Firefox, Safari, Edge)
5. **Update browser** ke versi terbaru

---

### Website sangat lambat / lag

**Gejala:**

- Setiap klik lambat direspons
- Scroll tidak smooth
- Input data lag

**Solusi:**

1. **Periksa kecepatan internet:**
   - Speed test di speedtest.net
   - Minimal 1 Mbps untuk GENY-StuntCare
2. **Kurangi beban:**
   - Tutup tab lain
   - Tutup aplikasi heavy (video, games)
   - Restart browser
3. **Pembersihan device:**
   - Clear browser cache
   - Hapus temporary files
   - Restart device

---

## 🖥️ Masalah Browser & Kompatibilitas

### Fitur tidak bekerja di browser lama

**Gejala:**

- Tombol tidak bisa diklik
- Layout berantakan
- Error di console

**Solusi:**

1. **Update browser ke versi terbaru:**
   - Chrome: Menu → Help → About Google Chrome
   - Firefox: Menu → Help → About Firefox
   - Safari: App Store → Updates
   - Edge: Menu → Help → About Microsoft Edge
2. Coba browser modern lain jika tetap error
3. Minimal requirements: Chrome 80+, Firefox 75+, Safari 12+

---

## 📞 Hubungi Support

Jika masalah tidak bisa diselesaikan:

📧 **Email:** support@geny-stuntcare.id  
💬 **Chat (Dalam App):** Senin-Jumat 08:00-18:00 WIB  
📱 **WhatsApp:** +62 812-XXXX-XXXX  
🌐 **Website:** www.geny-stuntcare.id

---

## Tips Mencegah Masalah

:::tip
✅ **Regular Update** - Update browser & OS secara berkala  
✅ **Backup Data** - Export laporan PDF setiap bulan  
✅ **Secure Account** - Password kuat, Enable 2FA  
✅ **Check Connection** - Periksa internet sebelum input data penting
:::

Panduan ini akan terus diupdate berdasarkan pertanyaan user.
