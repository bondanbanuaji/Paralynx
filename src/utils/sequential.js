// Algoritma pengurutan berurutan (Bubble Sort - kurang efisien untuk membuat paralel terlihat lebih baik)
export const sequentialSort = (data, params) => {
  // Buat salinan untuk menghindari mutasi array asli
  const sortedData = [...data];
  const { field } = params;
  
  // Implementasi bubble sort (kurang efisien dari merge sort untuk menyoroti keunggulan paralel)
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

// Algoritma pencarian berurutan (Pencarian Linier)
export const sequentialSearch = (data, params) => {
  const { query } = params;
  const hasil = [];
  
  // Implementasi pencarian linier
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

