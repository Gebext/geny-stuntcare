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
6. Hubungi support dengan screenshot

---

### Reset password tidak bekerja

**Gejala:** Tidak menerima email reset atau link tidak valid

**Solusi:**

1. Tunggu 5 menit setelah klik "Lupa Password"
2. Cek folder Spam email
3. Link reset hanya valid 30 menit, klik lagi jika expired
4. Gunakan browser baru (bukan private mode)
5. Jika masih tidak bisa, hubungi support@geny-stuntcare.id

---

### Akun terkunci setelah percobaan login berulang

**Gejala:** Muncul pesan "Akun terkunci untuk sementara"

**Solusi:**

1. Tunggu 30 menit sebelum coba login lagi
2. Reset password melalui "Lupa Password"
3. Jika terus terkunci, hubungi support untuk unlock manual

---

## 📊 Masalah Input Data

### Data tidak tersimpan setelah diklik Simpan

**Gejala:** Klik Simpan tapi data tidak muncul di list

**Solusi:**

1. Periksa koneksi internet Anda
2. Tunggu loading selesai (jangan refresh)
3. Lihat pesan notifikasi di atas (ada error?)
4. Coba clear cache browser:
   - Chrome: Ctrl+Shift+Delete
   - Firefox: Ctrl+Shift+Delete
   - Safari: Cmd+Shift+Delete
5. Coba input lagi dengan data baru
6. Gunakan browser berbeda

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
4. Jika masih error, hubungi support dengan screenshot

---

### Tidak bisa edit data yang sudah tersimpan

**Gejala:** Tombol edit tidak aktif atau tidak bisa mengubah

**Solusi:**

1. Hanya data dalam 1 bulan terakhir bisa diedit
2. Untuk data lama, hubungi support untuk correction
3. Jika ingin ubah data lama, masukkan data baru dengan tanggal benar
4. Periksa permission Anda di pengaturan privasi

---

### Data duplikat (sama muncul berkali-kali)

**Gejala:** Satu pengukuran muncul 2-3x di riwayat

**Solusi:**

1. Refresh halaman (F5 atau Cmd+R)
2. Clear cache browser dan refresh
3. Logout dan login ulang
4. Jika masih duplikat, hubungi support dengan tanggal pengukuran

---

## 📈 Masalah Grafik & Data Visualisasi

### Grafik tidak muncul / blank

**Gejala:** Area grafik kosong, tidak ada garis

**Solusi:**

1. Pastikan data minimal 2 pengukuran
2. Refresh halaman (F5)
3. Clear browser cache
4. Coba browser lain (Chrome, Firefox, Safari)
5. Tunggu beberapa menit jika server sedang proses
6. Hubungi support jika tetap blank

---

### Grafik tampilan aneh / garis naik-turun ekstrem

**Gejala:** Grafik tidak smooth, ada lonjakan tidak wajar

**Solusi:**

1. **Data mungkin salah input** - Cek ulang nilai pengukuran
2. Bandingkan dengan pencatatan manual Anda
3. Jika ada data yang error, hubungi support untuk delete
4. Input data yang benar setelahnya

---

### Tidak bisa zoom atau detail grafik

**Gejala:** Tidak bisa lihat data spesifik di grafik

**Solusi:**

1. Klik 2x pada area grafik untuk zoom
2. Gunakan mouse scroll untuk scroll grafik
3. Di mobile, gunakan 2 jari untuk pinch zoom
4. Coba landscape mode jika portrait terlalu sempit

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
6. Hubungi support jika tetap tidak muncul

---

### Rekomendasi berbeda dari dokter

**Gejala:** AI bilang risiko rendah tapi dokter bilang sebaliknya

**Solusi:**

1. **Rekomendasi AI bukan diagnosis medis** - Ikuti saran dokter
2. AI hanya berdasarkan data antropometri
3. Dokter mempertimbangkan faktor lain (kesehatan keseluruhan)
4. Jika ada perbedaan signifikan, beri feedback untuk improve AI

---

### Rekomendasi nutrisi tidak sesuai

**Gejala:** Saran makanan tidak cocok untuk anak Anda

**Solusi:**

1. Gunakan rekomendasi sebagai referensi, bukan mutlak
2. Konsultasi dengan ahli gizi untuk plan khusus
3. Pertimbangkan alergi/pantangan anak
4. Beri feedback di menu Saran untuk improve

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
6. Hubungi support via email jika chat error

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
4. Untuk kasus darurat, hubungi 112 atau RS terdekat
5. Coba hubungi via WhatsApp/Email jika urgent

---

### Chat history hilang

**Gejala:** Percakapan lama tidak ada

**Solusi:**

1. Scroll ke atas di halaman chat untuk lihat history
2. Clear cache browser BISA menghapus history lokal
3. Jika history tidak ada, kami memiliki backup server-side
4. Hubungi support untuk request history lengkap

---

### Tidak bisa upload file di chat

**Gejala:** Tombol upload tidak aktif atau file tidak masuk

**Solusi:**

1. Format yang didukung: JPG, PNG, PDF (max 5MB)
2. Cek ukuran file, compress jika terlalu besar
3. Coba format berbeda (JPG instead of PNG)
4. Jika upload error, coba manual input dulu (chat text)
5. Upload file setelah chat terkirim

---

## 🔐 Masalah Keamanan & Privasi

### Lupa password

**Gejala:** Tidak ingat password akun

**Solusi:**

1. Klik "Lupa Password?" di halaman login
2. Masukkan email terdaftar
3. Cek email untuk link reset
4. Buat password baru yang kuat
5. Login dengan password baru
6. Jika email tidak diterima, hubungi support

---

### Akun mungkin di-hack

**Gejala:**

- Muncul aktivitas yang tidak dikenali
- Password tidak bekerja lagi
- Data berubah tanpa sepengetahuan

**Solusi (URGENT):**

1. **Reset password segera** (gunakan "Lupa Password")
2. **Aktifkan 2FA** (2-Factor Authentication) di Pengaturan
3. **Lihat aktivitas login** di Pengaturan → Keamanan
4. **Logout dari semua device** jika curiga
5. **Hubungi support** segera dengan detail kejadian

---

### Tidak bisa setup 2FA

**Gejala:** Kode 2FA tidak diterima atau app tidak jalan

**Solusi:**

1. Install authenticator app: Google Authenticator, Microsoft Authenticator, atau Authy
2. Scan QR code dengan aplikasi
3. Jika QR code tidak kebaca, gunakan kode manual
4. Pastikan waktu device sinkron (auto time zone)
5. Jika tetap error, hubungi support untuk disable 2FA

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
6. Jika masih tidak bisa, server mungkin down - cek di social media kami

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
4. **Gunakan browser yang lebih ringan:** Firefox daripada Chrome, atau Opera
5. Jika semua orang komplain lambat, server kami mungkin sedang maintenance

---

### Tidak bisa akses dari WiFi kantor/sekolah

**Gejala:** Bisa dari rumah tapi tidak dari kantor/sekolah

**Solusi:**

1. WiFi kantor mungkin memblokir website
2. Gunakan **mobile data** (turn off WiFi)
3. Minta admin IT untuk whitelist domain geny-stuntcare.id
4. Gunakan VPN (Private Internet Access, Surfshark) jika allowed
5. Hubungi support dengan detail network (IPv4, ISP)

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

### Tampilan layout berantakan (tidak responsive)

**Gejala:**

- Text overlapping
- Tombol posisi aneh
- Menu tidak muncul

**Solusi:**

1. Clear browser cache (Ctrl+Shift+Delete)
2. Zoom default: Ctrl+0 (zero)
3. Refresh halaman (F5)
4. Coba ukuran window berbeda
5. Coba landscape/portrait mode jika mobile
6. Update browser

---

### Mobile app / offline mode tidak jalan

**Gejala:**

- Mobile app tidak bisa download
- Offline mode tidak tersimpan

**Solusi:**

1. Mobile app dalam tahap development, belum released
2. Saat ini akses melalui **mobile web browser**
3. Bookmark website untuk akses cepat
4. Dapat pasang "Add to Home Screen" untuk shortcut
5. Follow social media kami untuk update release mobile app

---

## 📞 Hubungi Support

Jika masalah tidak bisa diselesaikan:

### Via Chat (Dalam App)

- **Waktu:** Senin-Jumat 08:00-18:00, Sabtu 08:00-14:00 WIB
- **Respons:** 30 menit - 2 jam
- Klik menu Help atau Chat di aplikasi

### Email

- **Email:** support@geny-stuntcare.id
- **Respons:** 24 jam kerja
- Lampirkan screenshot & detail masalah

### WhatsApp

- **Nomor:** +62 812-XXXX-XXXX (akan ditambahkan)
- **Waktu:** Senin-Jumat 09:00-17:00 WIB
- Singkat dan jelas dalam penjelasan

### Media Sosial

- **Instagram:** @geny.stuntcare
- **Facebook:** Geny StuntCare
- **Twitter:** @geny_stuntcare

### Lokasi Offline

- **Kantor:** [Alamat akan ditambahkan]
- Langsung konsultasi dengan staff kami

---

## Tips Mencegah Masalah

✅ **Regular Update**

- Update browser & OS secara berkala
- Enable auto-update di device

✅ **Backup Data**

- Export laporan PDF setiap bulan
- Simpan file di cloud (Google Drive, OneDrive)

✅ **Secure Account**

- Gunakan password kuat (min 12 karakter)
- Enable 2FA untuk keamanan ekstra
- Tidak bagikan password dengan siapa pun

✅ **Connection**

- Periksa koneksi sebelum input data penting
- Tunggu sampai "Tersimpan" muncul
- Jangan tutup aplikasi saat sedang upload

---

_Panduan ini akan terus diupdate berdasarkan pertanyaan user._  
_Terakhir diperbarui: 30 Januari 2026_
