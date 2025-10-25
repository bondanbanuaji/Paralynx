// Fungsi merge untuk menggabungkan dua array yang sudah diurutkan
export const merge = (kiri, kanan, field) => {
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

// Implementasi merge sort
export const mergeSort = (data, field) => {
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
};