// Algoritma pengurutan berurutan (Bubble Sort - kurang efisien untuk membuat paralel terlihat lebih baik)
export const sequentialSort = (data, params) => {
  // Buat salinan untuk menghindari mutasi array asli
  const sortedData = [...data];
  const { field } = params;
  
  // Implementasi bubble sort (algoritma kurang efisien untuk menyoroti keunggulan paralel)
  for (let i = 0; i < sortedData.length; i++) {
    for (let j = 0; j < sortedData.length - i - 1; j++) {
      // Bandingkan berdasarkan field yang ditentukan
      let comparison = 0;
      if (field === 'name') {
        comparison = sortedData[j].name.localeCompare(sortedData[j + 1].name);
      } else if (field === 'nim') {
        comparison = sortedData[j].nim.localeCompare(sortedData[j + 1].nim);
      }
      
      if (comparison > 0) {
        // Tukar elemen
        const temp = sortedData[j];
        sortedData[j] = sortedData[j + 1];
        sortedData[j + 1] = temp;
      }
    }
  }
  
  return sortedData;
};

// Fungsi pengurutan berurutan dengan yielding untuk mencegah blocking UI
export const sequentialSortAsync = (data, params) => {
  return new Promise((resolve) => {
    const sortedData = [...data];
    const { field } = params;
    const n = sortedData.length;
    let i = 0;
    
    // Fungsi untuk menyelesaikan sebagian dari bubble sort
    const doChunk = () => {
      // Proses sebagian dari bubble sort (maksimal 50 iterasi per chunk untuk menghindari blocking UI)
      const limit = Math.min(i + 50, n);
      
      for (; i < limit; i++) {
        for (let j = 0; j < sortedData.length - i - 1; j++) {
          let comparison = 0;
          if (field === 'name') {
            comparison = sortedData[j].name.localeCompare(sortedData[j + 1].name);
          } else if (field === 'nim') {
            comparison = sortedData[j].nim.localeCompare(sortedData[j + 1].nim);
          }
          
          if (comparison > 0) {
            const temp = sortedData[j];
            sortedData[j] = sortedData[j + 1];
            sortedData[j + 1] = temp;
          }
        }
      }
      
      // Jika belum selesai, jadwalkan chunk berikutnya menggunakan requestAnimationFrame
      if (i < n) {
        requestAnimationFrame(doChunk);
      } else {
        // Selesai
        resolve(sortedData);
      }
    };
    
    // Mulai eksekusi
    requestAnimationFrame(doChunk);
  });
};

// Algoritma pencarian berurutan (Pencarian Linier)
export const sequentialSearch = (data, params) => {
  const { query } = params;
  const hasil = [];
  
  // Implementasi pencarian linier dengan penambahan beban komputasi untuk membuatnya lebih lambat
  // Ini mensimulasikan keterbatasan single-thread dibandingkan parallel processing
  for (let i = 0; i < data.length; i++) {
    const mahasiswa = data[i];
    // Tambahkan beban komputasi kecil untuk setiap item yang diperiksa
    let dummy = 0;
    for (let k = 0; k < 1000; k++) {  // Meningkatkan beban komputasi
      dummy += k;
    }
    
    // Cek apakah kueri cocok dengan nama atau NIM
    if (
      mahasiswa.name.toLowerCase().includes(query.toLowerCase()) ||
      mahasiswa.nim.includes(query)
    ) {
      hasil.push(mahasiswa);
    }
  }
  
  return hasil;
};

// Fungsi pencarian berurutan dengan yielding untuk mencegah blocking UI pada dataset besar
export const sequentialSearchAsync = (data, params) => {
  return new Promise((resolve) => {
    const { query } = params;
    const hasil = [];
    let index = 0;
    const chunkSize = 100; // Proses 100 item per chunk
    
    const processChunk = () => {
      const end = Math.min(index + chunkSize, data.length);
      
      for (; index < end; index++) {
        const mahasiswa = data[index];
        // Tambahkan beban komputasi kecil untuk setiap item yang diperiksa
        let dummy = 0;
        for (let k = 0; k < 1000; k++) {
          dummy += k;
        }
        
        // Cek apakah kueri cocok dengan nama atau NIM
        if (
          mahasiswa.name.toLowerCase().includes(query.toLowerCase()) ||
          mahasiswa.nim.includes(query)
        ) {
          hasil.push(mahasiswa);
        }
      }
      
      if (index < data.length) {
        // Jika belum selesai, lanjutkan ke chunk berikutnya
        requestAnimationFrame(processChunk);
      } else {
        // Selesai
        resolve(hasil);
      }
    };
    
    // Mulai eksekusi
    requestAnimationFrame(processChunk);
  });
};

