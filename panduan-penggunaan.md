# Panduan Penggunaan Aplikasi Generator Undangan Pernikahan

## Daftar Isi
- [Pendahuluan](#pendahuluan)
- [Memulai](#memulai)
- [Mengelola Template](#mengelola-template)
- [Mengelola Daftar Tamu](#mengelola-daftar-tamu)
- [Preview Undangan](#preview-undangan)
- [Export dan Pengiriman](#export-dan-pengiriman)
- [Tips dan Trik](#tips-dan-trik)

## Pendahuluan

Selamat datang di aplikasi Generator Undangan Pernikahan untuk pernikahan Putri Shahya Maharani & Bayu Agung Prakoso! Aplikasi ini dirancang untuk memudahkan Anda dalam membuat, mengelola, dan mengirimkan undangan digital kepada para tamu undangan.

**Catatan Penting:**
- Semua data tersimpan secara lokal di browser Anda
- Tidak diperlukan koneksi internet kecuali saat mengirim undangan via WhatsApp
- Fitur import dari kontak perangkat hanya tersedia di Chrome Android (versi 80+)

## Memulai

Aplikasi ini memiliki empat menu utama yang dapat diakses melalui tab di bagian atas:
1. **Template** - Untuk memilih dan melihat template undangan
2. **Tamu** - Untuk mengelola daftar tamu undangan
3. **Preview** - Untuk melihat pratinjau undangan sebelum dikirim
4. **Export** - Untuk mengekspor dan mengirim undangan

## Mengelola Template

Tab Template berisi berbagai pilihan template undangan yang dapat Anda gunakan.

### Memilih Template
1. Klik pada tab **Template**
2. Browse melalui template yang tersedia (Formal dan Informal)
3. Klik pada template untuk melihat pratinjau
4. Klik tombol **Pilih Template** untuk menetapkan template yang akan digunakan

### Template yang Tersedia
- **Template Formal** - Cocok untuk undangan resmi dengan bahasa formal
- **Template Informal** - Cocok untuk undangan dengan bahasa yang lebih santai

Setiap template sudah berisi tag `{nama_tamu}` yang nantinya akan otomatis diisi dengan nama tamu yang sesuai.

## Mengelola Daftar Tamu

Tab Tamu memungkinkan Anda untuk menambah, mengedit, dan mengelola daftar tamu.

### Menambahkan Tamu Secara Manual
1. Klik tab **Tamu**
2. Klik tombol **Tambah Tamu**
3. Isi formulir dengan:
   - Nama Tamu (wajib diisi)
   - Nomor WhatsApp (opsional, format: 08xxx, +628xxx, atau 628xxx)
4. **Fitur Baru**: Klik tombol **Import** di samping kolom nama untuk mengimpor data dari kontak perangkat (hanya tersedia di Chrome Android)
5. Klik **Simpan**

### Import Tamu dari File CSV
1. Klik tombol **Import CSV**
2. Pilih file CSV dari komputer Anda
3. File CSV harus memiliki kolom:
   - Nama (wajib)
   - WhatsApp (opsional)
4. Anda dapat mengunduh contoh file CSV dengan mengklik "Download contoh file CSV"

### Import Tamu dari Kontak Perangkat (Fitur Baru)
**Catatan**: Fitur ini hanya tersedia di browser Chrome pada perangkat Android.

#### Import Satu Kontak (Helper Form)
1. Klik tombol **Tambah Tamu**
2. Klik tombol **Import** di samping kolom nama
3. Pilih satu kontak dari daftar kontak perangkat
4. Data nama dan nomor telepon akan otomatis mengisi formulir
5. Review dan edit jika diperlukan, lalu klik **Simpan**

#### Import Banyak Kontak Sekaligus
1. Klik tombol **Import dari Kontak** (tombol ungu di samping Import CSV)
2. Pilih beberapa kontak sekaligus dari daftar kontak perangkat
3. Sistem akan memproses semua kontak yang dipilih:
   - Memvalidasi nomor WhatsApp
   - Mendeteksi dan melewati kontak duplikat
   - Memformat nomor telepon secara otomatis
4. Pesan konfirmasi akan menampilkan:
   - Jumlah kontak yang berhasil diimpor
   - Jumlah kontak dengan nomor WhatsApp valid
   - Daftar kontak duplikat yang dilewati

### Mengedit atau Menghapus Tamu
- **Edit**: Klik ikon pensil (✏️) di samping nama tamu
- **Hapus**: Klik ikon sampah (🗑️) di samping nama tamu

### Filter dan Pencarian
- Gunakan kolom pencarian untuk mencari tamu berdasarkan nama atau nomor WhatsApp
- Gunakan dropdown filter untuk memfilter tamu berdasarkan status (Semua, Sudah Dikirim, Belum Dikirim)

### Menandai Status Pengiriman
- Geser tombol switch di samping nama tamu untuk menandai undangan sebagai "Sudah Dikirim" atau "Belum Dikirim"
- Anda juga dapat menandai beberapa tamu sekaligus dengan:
  1. Pilih tamu dengan mencentang kotak di samping nama
  2. Klik "Tandai Dikirim" atau "Tandai Belum Dikirim"

## Preview Undangan

Tab Preview memungkinkan Anda untuk melihat pratinjau undangan sebelum dikirim.

### Melihat Pratinjau
1. Klik tab **Preview**
2. Pilih tamu dari daftar dropdown
3. Lihat pratinjau undangan yang dipersonalisasi untuk tamu tersebut

Pratinjau akan menampilkan template yang telah dipilih dengan nama tamu yang sudah disisipkan.

## Export dan Pengiriman

Tab Export menyediakan opsi untuk mengekspor dan mengirim undangan.

### Pilih Tamu untuk Dikirimi Undangan
1. Klik tab **Export**
2. Pilih tamu dengan mencentang kotak di samping nama, atau gunakan tombol:
   - **Pilih Semua** - Memilih semua tamu
   - **Pilih Belum Dikirim** - Hanya memilih tamu yang belum menerima undangan
   - **Batal Pilih** - Membatalkan semua pilihan

### Mengirim Via WhatsApp
1. Pilih tamu yang ingin dikirimi undangan
2. Klik tombol **WhatsApp** di samping nama tamu
3. Browser akan membuka WhatsApp Web dengan pesan yang sudah dipersonalisasi
4. Klik tombol kirim di WhatsApp

### Salin Pesan
1. Pilih tamu yang ingin dikirimi undangan
2. Klik tombol **Salin** di samping nama tamu untuk menyalin pesan individual
3. Atau klik **Salin [jumlah] Pesan** untuk menyalin semua pesan terpilih sekaligus

### Download Semua Pesan
1. Klik tombol **Download sebagai File**
2. File teks berisi semua pesan undangan akan diunduh ke komputer Anda

### Menandai Status Pengiriman
- Setelah mengirim undangan, geser tombol switch untuk menandai undangan sebagai "Sudah Dikirim"
- Atau gunakan tombol **Tandai [jumlah] Tamu Sebagai Dikirim** untuk menandai beberapa tamu sekaligus

## Tips dan Trik

### Untuk Pengelolaan Tamu yang Efisien
- **Import Massal**: Gunakan fitur "Import dari Kontak" untuk menambahkan banyak tamu sekaligus langsung dari kontak perangkat (Chrome Android)
- **Import CSV**: Gunakan fitur impor CSV untuk menambahkan banyak tamu dari file spreadsheet
- **Helper Import**: Gunakan tombol "Import" di formulir tambah tamu untuk mengisi data dengan cepat dari satu kontak
- Manfaatkan filter untuk fokus pada tamu yang belum menerima undangan
- Tandai tamu sebagai "Sudah Dikirim" segera setelah mengirim undangan

### Untuk Pengiriman yang Cepat
- Kirim ke beberapa tamu dengan nomor WhatsApp sekaligus dengan membuka banyak tab WhatsApp
- Salin semua pesan untuk tamu yang tidak memiliki WhatsApp dan kirim melalui media lain

### Optimalisasi Penyimpanan
- Data tersimpan di browser secara lokal (localStorage)
- Jangan menghapus data browsing/cache jika ingin menyimpan data tamu dan template
- Gunakan browser yang sama untuk mengelola undangan agar data tetap konsisten

### Troubleshooting Import Kontak
**Jika tombol "Import dari Kontak" tidak muncul:**
- Pastikan menggunakan browser Chrome di perangkat Android
- Pastikan Chrome versi 80 atau lebih baru
- Pastikan mengakses aplikasi melalui HTTPS

**Jika import kontak gagal:**
- Pastikan memberikan izin akses kontak saat diminta
- Coba tutup dan buka kembali aplikasi
- Pastikan kontak tersimpan di perangkat (bukan hanya di akun Google)

**Jika nomor WhatsApp tidak valid:**
- Sistem akan tetap mengimpor kontak tanpa nomor WhatsApp
- Anda dapat menambahkan nomor WhatsApp secara manual setelah import
- Format yang didukung: 08xxx, +628xxx, 628xxx

---

Aplikasi Generator Undangan Pernikahan ini dirancang untuk membuat proses pengiriman undangan pernikahan menjadi lebih efisien dan personal. Selamat menggunakan aplikasi ini dan selamat merayakan hari bahagia Anda!

*Terakhir diperbarui: 1 Juli 2025 - Ditambahkan fitur Import dari Kontak*
