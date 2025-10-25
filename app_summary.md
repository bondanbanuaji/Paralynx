
---

> **🎯 Goal:**
> Buatkan **web app interaktif** berbasis **Vite + React (JSX)** untuk proyek:
>
> 🧠 *“Analisis Perbandingan Kecepatan Komputasi Sequential dan Parallel pada Proses Pencarian dan Pengurutan Data Mahasiswa Menggunakan Web Worker (JavaScript)”*
>
> Fokus pada performa **sequential vs parallel** dalam proses **pencarian (searching)** dan **pengurutan (sorting)** data mahasiswa.

---

## 🧩 **Spesifikasi Teknis**

**🔧 Tech Stack:**

* ⚙️ Frontend: **Vite + React (JSX)**
* 🎨 Styling: **Tailwind CSS**
* 🧠 Parallel Engine: **Web Worker API**
* 📊 Opsional Visualisasi: **Chart.js** (bisa ditambahkan nanti)

---

## ⚙️ **Fitur Aplikasi**

1. **Generate Data Mahasiswa Acak**

   * Input jumlah data dari user.
   * Generate nama orang Indonesia secara acak + NIM unik 10 digit.
   * Tampilkan di tabel responsive.

2. **Mode Komputasi**

   * ✅ *Sequential Mode:* dijalankan di main thread.
   * ⚡ *Parallel Mode:* menggunakan Web Worker untuk mempercepat proses.
   * Timer dimulai setelah data diterima worker dan berhenti sebelum return (tidak menghitung overhead).

3. **Fungsi Utama**

   * 🔍 Searching (by nama / NIM)
   * ↕️ Sorting (by nama A-Z, by NIM ascending)
   * ⏱️ Perbandingan waktu eksekusi sequential vs parallel
   * 📈 Hasil waktu tampil berdampingan (ms)

4. **UI**

   * Form input jumlah data.
   * Tombol generate, tombol sort, tombol search.
   * Tabel hasil data + durasi eksekusi.
   * Tombol toggle “Sequential / Parallel”.

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

**Searching**

* Sequential: Linear Search
* Parallel: Data dibagi ke beberapa chunk dan dikirim ke beberapa worker untuk dicari bersamaan.

**Sorting**

* Sequential: Bubble Sort atau Insertion Sort
* Parallel: Parallel Merge Sort (subset diurutkan di tiap worker, lalu digabung di main thread).

**Kompleksitas:**

* Sequential Search → O(n)
* Parallel Search → O(n/p)
* Sequential Sort → O(n²)
* Parallel Sort → O((n log n)/p)

---

## 🧠 **Behavior Web Worker**

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

* Web app siap dijalankan (`npm run dev`).
* UI tampil rapi dengan Tailwind.
* Hasil perbandingan waktu (sequential vs parallel) muncul di layar.
* Semua fungsi berjalan real-time di browser tanpa reload.

---

## 🧱 **Tambahan (Opsional)**

* Tambahkan toggle dark mode (Tailwind)
* Tambahkan tombol “Export Hasil ke CSV”
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
* Lakukan sorting & searching
* Bandingkan sequential vs parallel secara real-time
* Menampilkan hasil perbandingan performa yang akurat

---
