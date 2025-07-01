import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { Book, ArrowLeft } from 'lucide-react';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

const Help: React.FC = () => {
  const navigate = useNavigate();

  // Handle smooth scrolling for anchor links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.getElementById(hash.substring(1));
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    };

    // Handle initial hash on page load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  // Handle anchor link clicks within the component
  const handleAnchorClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
      event.preventDefault();
      const hash = target.getAttribute('href')!;
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        // Update URL without triggering page reload
        window.history.pushState(null, '', hash);
      }
    }
  };
  const markdownContent = `
# Panduan Penggunaan Aplikasi Generator Undangan Pernikahan

## Daftar Isi
- [Pendahuluan](#pendahuluan)
- [Memulai](#memulai)
- [Mengelola Template](#mengelola-template)
- [Mengelola Daftar Tamu](#mengelola-daftar-tamu)
- [Kirim Pesan (dengan Preview)](#kirim-pesan-dengan-preview)
- [Tips dan Trik](#tips-dan-trik)

## Pendahuluan

Selamat datang di aplikasi Generator Undangan Pernikahan untuk pernikahan Putri Shahya Maharani & Bayu Agung Prakoso! Aplikasi ini dirancang untuk memudahkan Anda dalam membuat, mengelola, dan mengirimkan undangan digital kepada para tamu undangan.

**Catatan Penting:**
- Semua data tersimpan secara lokal di browser Anda
- Tidak diperlukan koneksi internet kecuali saat mengirim undangan via WhatsApp
- Fitur import dari kontak perangkat hanya tersedia di Chrome Android (versi 80+)

## Memulai

Aplikasi ini memiliki tiga menu utama yang dapat diakses melalui tab di bagian atas:
1. **Template** - Untuk memilih dan melihat template undangan
2. **Tamu** - Untuk mengelola daftar tamu undangan
3. **Kirim** - Untuk mengirim undangan (dengan fitur preview terintegrasi)

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

Setiap template sudah berisi tag \`{nama_tamu}\` yang nantinya akan otomatis diisi dengan nama tamu yang sesuai.

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

### Mengelola Label Tamu (Fitur Baru)
Label membantu mengorganisir tamu berdasarkan kategori seperti Keluarga, Teman, Kerja, dll.

#### Menambahkan Label pada Tamu
1. Saat membuat atau mengedit tamu, scroll ke bagian **Label**
2. Ketik label baru di kolom input (contoh: "Keluarga", "Teman SMA", "Rekan Kerja")
3. Tekan **Enter** atau klik tombol **+** untuk menambahkan label
4. Ulangi untuk menambahkan beberapa label pada satu tamu
5. Untuk menghapus label, klik ikon **×** di samping label

#### Kelola Label yang Tersedia
Jika sudah ada label dalam sistem, akan muncul bagian **Label Tersedia** yang menampilkan:
- Semua label yang pernah dibuat
- Jumlah tamu untuk setiap label
- Klik label untuk langsung memfilter tamu dengan label tersebut

#### Operasi Label Massal
Untuk tamu yang sudah dipilih (dicentang), Anda dapat:
1. **Menambah label**: Pilih label dari dropdown **+ Tambah Label**
2. **Menghapus label**: Klik tombol **- [Nama Label]** yang muncul untuk label yang ada pada tamu terpilih

### Filter dan Pencarian
- **Pencarian**: Gunakan kolom pencarian untuk mencari tamu berdasarkan nama atau nomor WhatsApp
- **Filter Status**: Gunakan dropdown filter untuk memfilter tamu berdasarkan status (Semua, Sudah Dikirim, Belum Dikirim)
- **Filter Label**: Pilih satu atau beberapa label dari dropdown filter label untuk menampilkan tamu dengan label tertentu
- **Indikator Filter**: Filter yang aktif akan ditampilkan sebagai badge berwarna yang dapat dihapus dengan mengklik ikon ×

### Menandai Status Pengiriman
- Geser tombol switch di samping nama tamu untuk menandai undangan sebagai "Sudah Dikirim" atau "Belum Dikirim"
- Anda juga dapat menandai beberapa tamu sekaligus dengan:
  1. Pilih tamu dengan mencentang kotak di samping nama
  2. Klik "Tandai Dikirim" atau "Tandai Belum Dikirim"

### Operasi Massal untuk Tamu Terpilih
Setelah memilih beberapa tamu dengan mencentang kotak di samping nama, Anda dapat melakukan:
- **Pilih Semua/Batal Pilih**: Untuk memilih atau membatalkan pilihan semua tamu yang terlihat
- **Tandai Status**: Ubah status pengiriman beberapa tamu sekaligus
- **Kelola Label**: Tambah atau hapus label dari beberapa tamu sekaligus

## Kirim Pesan (dengan Preview)

Tab Kirim menyediakan fitur preview terintegrasi dan opsi untuk mengirim undangan. Anda dapat melihat pratinjau pesan sebelum mengirimkannya tanpa perlu berpindah tab.

### Melihat Preview Pesan
1. Klik tab **Kirim**
2. Pilih tamu dari daftar dengan mencentang kotak di samping nama
3. Preview pesan akan otomatis muncul untuk setiap tamu yang dipilih
4. Lihat bagaimana pesan akan terlihat dengan nama tamu yang sudah disisipkan

### Pilih Tamu untuk Dikirimi Undangan
1. Klik tab **Kirim**
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
- **Organisir dengan Label**: Gunakan label untuk mengelompokkan tamu (contoh: "Keluarga", "Teman SMA", "Rekan Kerja")
- **Filter Efektif**: Kombinasikan filter status, pencarian, dan label untuk menemukan tamu dengan cepat
- Manfaatkan filter untuk fokus pada tamu yang belum menerima undangan
- Tandai tamu sebagai "Sudah Dikirim" segera setelah mengirim undangan

### Untuk Pengiriman yang Cepat
- **Preview Terintegrasi**: Gunakan fitur preview di tab Kirim untuk melihat pesan sebelum mengirim tanpa berpindah tab
- **Filter berdasarkan Label**: Gunakan filter label untuk mengirim undangan ke kelompok tertentu (misalnya kirim ke "Keluarga" dulu, lalu "Teman")
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
- Sistem akan tetap mengimpor kontak dengan nomor WhatsApp
- Anda dapat menambahkan nomor WhatsApp secara manual setelah import
- Format yang didukung: 08xxx, +628xxx, 628xxx

### Troubleshooting Pengiriman Pesan

**Jika nomor WhatsApp tidak tidak ditemukan:**
- Anda dapat mengubah nomor WhatsApp secara manual dengan nomor yang sesuai
- Anda juga dapat menyalin pesan dan mengirimkannya kepada tamu anda melalui platform selain whatsapp

### Tips Penggunaan Label
**Ide Label yang Berguna:**
- Berdasarkan hubungan: "Keluarga", "Teman", "Rekan Kerja"
- Berdasarkan asal: "Jakarta", "Bandung", "Luar Kota"
- Berdasarkan acara: "Resepsi", "Akad Saja", "VIP"
- Berdasarkan kategori: "Undangan Fisik", "Digital Saja"

**Best Practices:**
- Gunakan nama label yang konsisten dan mudah dipahami
- Jangan terlalu banyak label untuk satu tamu (maksimal 3-4)
- Manfaatkan filter label untuk pengiriman bertahap
- Gabungkan label dengan filter status untuk pengelolaan yang lebih efektif

---

Aplikasi Generator Undangan Pernikahan ini dirancang untuk membuat proses pengiriman undangan pernikahan menjadi lebih efisien dan personal. Dengan fitur preview yang terintegrasi langsung di tab pengiriman, Anda dapat melihat dan mengirim undangan dalam satu tempat. Selamat menggunakan aplikasi ini dan selamat merayakan hari bahagia Anda!

*Terakhir diperbarui: 1 Juli 2025 - Ditambahkan fitur Import dari Kontak, sistem Label untuk organisasi tamu, dan penyederhanaan alur kerja dengan menggabungkan preview ke tab pengiriman*`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add custom styles for anchor links and scroll offset */}
      <style>{`
        .anchor-link {
          text-decoration: none;
        }
        .anchor-link:hover {
          text-decoration: underline;
        }
        /* Add scroll offset to account for sticky header */
        h1[id], h2[id], h3[id], h4[id], h5[id], h6[id] {
          scroll-margin-top: 120px;
        }
      `}</style>
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 p-2 sm:p-3 rounded-lg">
                <Book className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  Panduan Penggunaan
                </h1>
                <p className="text-sm sm:text-base text-gray-600">Bantuan dan tutorial aplikasi</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 sm:p-8">
          <div
            className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
            onClick={handleAnchorClick}
          >
            <ReactMarkdown
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, {
                  behavior: 'wrap',
                  properties: {
                    className: ['anchor-link']
                  }
                }]
              ]}
            >
              {markdownContent}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
