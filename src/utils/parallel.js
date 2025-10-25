// Fungsi untuk membuat Web Worker untuk pemrosesan paralel
const createWorker = () => {
  const workerCode = `
    // Fungsi merge untuk merge sort di worker
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

    // Implementasi merge sort di worker
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

    // Implementasi pencarian linier di worker
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
  `;

  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
};

// Fungsi pengurutan paralel menggunakan Web Workers
export const parallelWorkerSort = (data, params) => {
  return new Promise((resolve, reject) => {
    // Gunakan lebih banyak worker untuk paralelisasi yang lebih baik, tetapi batasi ke panjang data
    const jumlahWorker = Math.min(navigator.hardwareConcurrency ? navigator.hardwareConcurrency * 2 : 8, data.length, 16); // Maks 16 worker
    const ukuranChunk = Math.ceil(data.length / jumlahWorker);
    const chunk = [];
    const workers = [];
    const hasil = new Array(jumlahWorker).fill(null);
    let workerSelesai = 0;

    // Bagi data menjadi chunk
    for (let i = 0; i < jumlahWorker; i++) {
      const start = i * ukuranChunk;
      const end = Math.min(start + ukuranChunk, data.length);
      if (start < data.length) {
        chunk.push(data.slice(start, end));
      }
    }

    // Buat dan mulai worker untuk setiap chunk
    for (let i = 0; i < chunk.length; i++) {
      const worker = createWorker();
      workers.push(worker);

      worker.postMessage({
        operation: 'sort',
        data: chunk[i],
        params,
        chunkIndex: i
      });

      worker.onmessage = (e) => {
        const { result, executionTime, chunkIndex } = e.data;
        hasil[chunkIndex] = result;
        workerSelesai++;

        // Ketika semua worker selesai, gabungkan hasilnya
        if (workerSelesai === chunk.length) {
          // Gabungkan semua chunk yang sudah diurut menggunakan pendekatan yang lebih efisien
          let finalResult = hasil[0];
          for (let i = 1; i < hasil.length; i++) {
            if (hasil[i]) {
              finalResult = mergeTwoArrays(finalResult, hasil[i], params.field);
            }
          }

          // Bersihkan worker
          workers.forEach(w => w.terminate());

          resolve(finalResult);
        }
      };

      worker.onerror = (error) => {
        console.error('Worker error:', error);
        reject(error);
        workers.forEach(w => w.terminate());
      };
    }
  });
};

// Fungsi pencarian paralel menggunakan Web Workers
export const parallelWorkerSearch = (data, params) => {
  return new Promise((resolve, reject) => {
    // Gunakan lebih banyak worker untuk paralelisasi yang lebih baik, tetapi batasi ke panjang data
    const jumlahWorker = Math.min(navigator.hardwareConcurrency ? navigator.hardwareConcurrency * 2 : 8, data.length, 16); // Maks 16 worker
    const ukuranChunk = Math.ceil(data.length / jumlahWorker);
    const chunk = [];
    const workers = [];
    const semuaHasil = [];
    let workerSelesai = 0;

    // Bagi data menjadi chunk
    for (let i = 0; i < jumlahWorker; i++) {
      const start = i * ukuranChunk;
      const end = Math.min(start + ukuranChunk, data.length);
      if (start < data.length) {
        chunk.push(data.slice(start, end));
      }
    }

    // Buat dan mulai worker untuk setiap chunk
    for (let i = 0; i < chunk.length; i++) {
      const worker = createWorker();
      workers.push(worker);

      worker.postMessage({
        operation: 'search',
        data: chunk[i],
        params,
        chunkIndex: i
      });

      worker.onmessage = (e) => {
        const { result, executionTime, chunkIndex } = e.data;
        semuaHasil.push(...result);
        workerSelesai++;

        // Ketika semua worker selesai, kembalikan hasil gabungan
        if (workerSelesai === chunk.length) {
          // Bersihkan worker
          workers.forEach(w => w.terminate());

          resolve(semuaHasil);
        }
      };

      worker.onerror = (error) => {
        console.error('Worker error:', error);
        reject(error);
        workers.forEach(w => w.terminate());
      };
    }
  });
};

// Fungsi merge untuk menggabungkan hasil yang sudah diurutkan
const mergeChunks = (chunk, field) => {
  if (chunk.length === 0) return [];
  if (chunk.length === 1) return chunk[0];
  
  let hasil = chunk[0];
  for (let i = 1; i < chunk.length; i++) {
    hasil = mergeTwoArrays(hasil, chunk[i], field);
  }
  
  return hasil;
};

// Fungsi merge untuk menggabungkan dua array yang sudah diurutkan
const mergeTwoArrays = (kiri, kanan, field) => {
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
};