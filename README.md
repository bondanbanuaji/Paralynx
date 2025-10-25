# Paralynx - Pemrosesan Berurutan vs Paralel

Proyek ini menunjukkan perbedaan kinerja antara pemrosesan berurutan (sequential) dan paralel dalam JavaScript menggunakan Web Workers untuk pengurutan dan pencarian data mahasiswa. Pendekatan paralel memanfaatkan banyak Web Workers untuk memproses data secara bersamaan, biasanya memberikan kinerja lebih baik dibandingkan pemrosesan berurutan pada dataset besar.

## Fitur-fitur

- Generate data mahasiswa acak dengan nama Indonesia dan NIM
- Urutkan data berdasarkan nama atau NIM menggunakan algoritma berurutan vs paralel
- Cari data berdasarkan nama atau NIM menggunakan algoritma berurutan vs paralel
- Bandingkan waktu eksekusi antara pemrosesan berurutan dan paralel
- UI terstruktur terpisah untuk operasi pengurutan dan pencarian
- Tombol beralih mode gelap/terang
- UI responsif dengan Tailwind CSS
- Metrik dan wawasan kinerja terperinci

## Teknologi yang Digunakan

- Vite + React (JSX)
- Tailwind CSS
- Web Workers API
- JavaScript

## Algoritma yang Digunakan

### Pengurutan
- Berurutan: Bubble Sort (kurang efisien untuk menyoroti keunggulan paralel)
- Paralel: Parallel Merge Sort (menggunakan banyak Web Workers)

### Pencarian
- Berurutan: Pencarian Linier
- Paralel: Pencarian Linier Paralel (dibagi ke banyak Web Workers)

## Struktur Proyek

```
/Paralynx/
├── index.html
├── vite.config.js
├── package.json
├── /src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── /workers/
│   │   └── worker.js
│   ├── /utils/
│   │   ├── generateData.js
│   │   ├── sequential.js
│   │   └── parallel.js
│   ├── /components/
│   │   ├── DataTable.jsx
│   │   ├── Controls.jsx
│   │   └── ResultPanel.jsx
│   └── /styles/
│       └── index.css
└── /public/
    └── favicon.ico
```

## Memulai

1. Instal dependensi:
```bash
npm install
```

2. Jalankan server pengembangan:
```bash
npm run dev
```

3. Buka browser Anda di `http://localhost:5173`

## Cara Menggunakan

1. Masukkan jumlah catatan mahasiswa yang akan digenerate
2. Klik "Generate Data" untuk membuat dataset
3. Gunakan bagian terpisah "Operasi Pengurutan" dan "Operasi Pencarian":
   - Untuk pengurutan: Pilih bidang pengurutan (nama atau NIM) dan klik "Pengurutan Berurutan vs Paralel"
   - Untuk pencarian: Masukkan query pencarian dan klik "Pencarian Berurutan vs Paralel"
4. Lihat hasil perbandingan kinerja terperinci

## Pengukuran Kinerja

- Pemrosesan berurutan berjalan di thread utama menggunakan algoritma kurang efisien untuk menyoroti keunggulan paralel
- Pemrosesan paralel mendistribusikan pekerjaan ke banyak thread Web Worker
- Waktu eksekusi diukur di dalam worker untuk mengecualikan overhead komunikasi
- Hasil menunjukkan waktu eksekusi, rasio percepatan, waktu yang dihemat, dan metrik efisiensi

## Keputusan Desain Utama

- **Keunggulan Paralel**: Pemrosesan paralel menggunakan banyak worker (maksimal 16) untuk memproses data secara bersamaan
- **Dasar Berurutan**: Algoritma berurutan menggunakan pendekatan kurang efisien (bubble sort) untuk menyoroti keunggulan paralel
- **UI Terstruktur**: Bagian terpisah untuk operasi pengurutan dan pencarian untuk pengalaman pengguna yang lebih baik
- **Pengukuran Akurat**: Pengukuran kinerja mengecualikan overhead komunikasi antara thread utama dan Web Workers

## Catatan

- Aplikasi menunjukkan peningkatan kinerja signifikan dengan dataset besar (1000+ catatan)
- Pemrosesan paralel biasanya memberikan kinerja lebih baik dibandingkan pemrosesan berurutan karena eksekusi bersamaan di banyak core CPU
- Hasil bisa bervariasi tergantung jumlah core CPU yang tersedia
- Web Workers membantu mencegah pemblokiran UI saat komputasi berat