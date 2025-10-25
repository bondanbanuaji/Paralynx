---
> **🎯 Tujuan:**
> Buatkan **aplikasi web interaktif** berbasis **Vite + React (JSX)** untuk proyek:
>
> 🧠 *"Analisis Perbandingan Kecepatan Komputasi Berurutan dan Paralel pada Proses Pencarian dan Pengurutan Data Mahasiswa Menggunakan Web Worker (JavaScript)"*
>
> Fokus pada performa **berurutan vs paralel** dalam proses **pencarian (searching)** dan **pengurutan (sorting)** data mahasiswa.
---

## 🧩 **Spesifikasi Teknis**

**🔧 Tumpukan Teknologi:**

* ⚙️ Frontend: **Vite + React (JSX)**
* 🎨 Styling: **Tailwind CSS**
* 🧠 Mesin Paralel: **Web Worker API**
* 📊 Visualisasi Opsional: **Chart.js** (bisa ditambahkan nanti)

---

## ⚙️ **Fitur Aplikasi**

1. **Generate Data Mahasiswa Acak**

   * Input jumlah data dari pengguna.
   * Generate nama orang Indonesia secara acak + NIM unik 10 digit.
   * Tampilkan di tabel responsif.

2. **Mode Komputasi**

   * ✅ *Mode Berurutan:* dijalankan di thread utama.
   * ⚡ *Mode Paralel:* menggunakan Web Worker untuk mempercepat proses.
   * Timer dimulai setelah data diterima worker dan berhenti sebelum return (tidak menghitung overhead).

3. **Fungsi Utama**

   * 🔍 Pencarian (berdasarkan nama / NIM)
   * ↕️ Pengurutan (berdasarkan nama A-Z, berdasarkan NIM menaik)
   * ⏱️ Perbandingan waktu eksekusi berurutan vs paralel
   * 📈 Hasil waktu tampil berdampingan (ms)

4. **UI**

   * Form input jumlah data.
   * Tombol generate, tombol sort, tombol search.
   * Tabel hasil data + durasi eksekusi.
   * Tombol toggle "Berurutan / Paralel".

---

## 📁 **Struktur Folder**

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

---

## 🧮 **Algoritma yang Digunakan**

**Pencarian**

* Berurutan: Pencarian Linier
* Paralel: Data dibagi ke beberapa bagian dan dikirim ke beberapa worker untuk dicari bersamaan.

**Pengurutan**

* Berurutan: Bubble Sort atau Insertion Sort
* Paralel: Parallel Merge Sort (subset diurutkan di tiap worker, lalu digabung di thread utama).

**Kompleksitas:**

* Pencarian Berurutan → O(n)
* Pencarian Paralel → O(n/p)
* Pengurutan Berurutan → O(n²)
* Pengurutan Paralel → O((n log n)/p)

---

## 🧠 **Perilaku Web Worker**

* Worker menerima pesan `{ mode: 'sort' | 'search', data, param }`
* Worker menjalankan algoritma di thread terpisah.
* Worker hanya mengembalikan hasil + waktu eksekusi internal.
* Jangan sertakan waktu `postMessage` dalam penghitungan performa.

---

## 💻 **Integrasi Frontend ↔ Worker**

Gunakan `new Worker(new URL('./workers/worker.js', import.meta.url))` agar kompatibel dengan bundling Vite.
Data dikirim ke worker menggunakan `postMessage()`, hasil diterima dengan `onmessage`.

---

## 🧩 **Output yang Diharapkan**

* Aplikasi web siap dijalankan (`npm run dev`).
* UI tampil rapi dengan Tailwind.
* Hasil perbandingan waktu (berurutan vs paralel) muncul di layar.
* Semua fungsi berjalan real-time di browser tanpa reload.

---

## 🧱 **Tambahan (Opsional)**

* Tambahkan toggle mode gelap (Tailwind)
* Tambahkan tombol "Ekspor Hasil ke CSV"
* Simpan log waktu eksekusi di localStorage untuk perbandingan beberapa kali percobaan

---

## 🚀 **Instruksi Build & Run**

```bash
npm create vite@latest paralynx -- --template react
cd paralynx
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# setup tailwind in index.css
npm run dev
```

---

## ✅ **Keluaran Akhir yang Diharapkan**

Aplikasi berjalan penuh di browser dengan kemampuan:

* Generate dataset besar (mis. 10.000 mahasiswa)
* Lakukan pengurutan & pencarian
* Bandingkan berurutan vs paralel secara real-time
* Menampilkan hasil perbandingan performa yang akurat

---