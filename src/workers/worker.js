// Ini adalah file placeholder untuk cocok dengan struktur proyek yang diharapkan
// Kode worker sebenarnya diimplementasikan sebaris di file parallel.js untuk kompatibilitas yang lebih baik dengan Vite

// Jika Anda lebih suka menggunakan file worker eksternal, Anda dapat membuka komentar dan menggunakan ini:

/*
self.onmessage = function(e) {
  const { operation, data, params, chunkIndex } = e.data;
  let result;

  // Mulai pengukuran waktu di dalam worker untuk mengecualikan overhead postMessage
  const startTime = performance.now();

  if (operation === 'sort') {
    result = mergeSort(data, params.field);
  } else if (operation === 'search') {
    result = linearSearch(data, params.query);
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  // Kembalikan hasil dengan informasi waktu
  self.postMessage({
    result,
    executionTime,
    chunkIndex
  });
};

// Fungsi merge untuk merge sort
function merge(kiri, kanan, field) {
  let hasil = [];
  let indeksKiri = 0;
  let indeksKanan = 0;

  while (indeksKiri < kiri.length && indeksKanan < kanan.length) {
    let comparison = 0;
    if (field === 'name') {
      comparison = kiri[indeksKiri].name.localeCompare(kanan[indeksKanan].name);
    } else if (field === 'nim') {
      comparison = kiri[indeksKiri].nim.localeCompare(kanan[indeksKanan].nim);
    }

    if (comparison <= 0) {
      hasil.push(kiri[indeksKiri]);
      indeksKiri++;
    } else {
      hasil.push(kanan[indeksKanan]);
      indeksKanan++;
    }
  }

  return hasil.concat(kiri.slice(indeksKiri)).concat(kanan.slice(indeksKanan));
}

// Implementasi merge sort
function mergeSort(data, field) {
  if (data.length <= 1) {
    return data;
  }

  const tengah = Math.floor(data.length / 2);
  const kiri = data.slice(0, tengah);
  const kanan = data.slice(tengah);

  return merge(
    mergeSort(kiri, field),
    mergeSort(kanan, field),
    field
  );
}

// Implementasi pencarian linier
function linearSearch(data, query) {
  const hasil = [];
  
  for (let i = 0; i < data.length; i++) {
    const mahasiswa = data[i];
    // Cek apakah kueri cocok dengan nama atau NIM
    if (
      mahasiswa.name.toLowerCase().includes(query.toLowerCase()) ||
      mahasiswa.nim.includes(query)
    ) {
      hasil.push(mahasiswa);
    }
  }
  
  return hasil;
}
*/