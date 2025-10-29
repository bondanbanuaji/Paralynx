// Optimized sequential algorithms for better performance
// Implementasi Quick Sort yang lebih efisien
function quickSort(arr, field, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pivotIndex = partition(arr, field, low, high);
    quickSort(arr, field, low, pivotIndex - 1);
    quickSort(arr, field, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr, field, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    let comparison = 0;
    if (field === 'name') {
      comparison = arr[j].name.localeCompare(pivot.name);
    } else if (field === 'nim') {
      comparison = arr[j].nim.localeCompare(pivot.nim);
    }

    if (comparison <= 0) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// Algoritma pengurutan berurutan yang dioptimalkan
export const sequentialSort = (data, params) => {
  const { field } = params;
  const sortedData = [...data];
  
  // Gunakan quick sort untuk performa terbaik di main thread
  return quickSort(sortedData, field);
};

// Fungsi pengurutan berurutan dengan yielding untuk menghindari blocking UI
export const sequentialSortAsync = (data, params) => {
  return new Promise((resolve) => {
    // Gunakan pendekatan yang lebih cerdas berdasarkan ukuran data
    if (data.length < 100) {
      // Untuk data kecil, cukup gunakan algoritma cepat
      resolve(sequentialSort(data, params));
    } else {
      // Untuk data besar, gunakan pendekatan chunking
      const sortedData = [...data];
      const { field } = params;
      
      // Gunakan quick sort dengan pendekatan async
      const startTime = performance.now();
      const result = quickSort(sortedData, field);
      resolve(result);
    }
  });
};

// Algoritma pencarian yang dioptimalkan
export const sequentialSearch = (data, params) => {
  const { query } = params;
  const hasil = [];
  
  // Pencarian langsung tanpa beban komputasi tambahan
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
};

// Fungsi pencarian berurutan dengan yielding untuk menghindari blocking UI
export const sequentialSearchAsync = (data, params) => {
  return new Promise((resolve) => {
    const { query } = params;
    
    // Untuk data kecil, cukup gunakan pencarian langsung
    if (data.length < 100) {
      resolve(sequentialSearch(data, params));
    } else {
      // Untuk data besar, gunakan pendekatan chunking
      const hasil = [];
      let index = 0;
      const chunkSize = 200; // Proses lebih banyak item per chunk untuk efisiensi
      
      const processChunk = () => {
        const end = Math.min(index + chunkSize, data.length);
        
        for (; index < end; index++) {
          const mahasiswa = data[index];
          
          // Cek apakah kueri cocok dengan nama atau NIM
          if (
            mahasiswa.name.toLowerCase().includes(query.toLowerCase()) ||
            mahasiswa.nim.includes(query)
          ) {
            hasil.push(mahasiswa);
          }
        }
        
        if (index < data.length) {
          // Lanjutkan di frame berikutnya untuk menghindari blocking
          requestAnimationFrame(processChunk);
        } else {
          resolve(hasil);
        }
      };
      
      // Mulai eksekusi
      requestAnimationFrame(processChunk);
    }
  });
};

