// Web Worker for parallel processing operations
self.onmessage = function(e) {
  const { operation, data, params, chunkIndex, operationId } = e.data;
  let result;

  // Mulai pengukuran waktu di dalam worker untuk mengecualikan overhead postMessage
  const startTime = performance.now();

  if (operation === 'sort') {
    result = quickSort([...data], params.field);
  } else if (operation === 'search') {
    result = linearSearch(data, params.query);
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  // Kembalikan hasil dengan informasi waktu
  self.postMessage({
    result,
    executionTime,
    chunkIndex,
    operationId
  });
};

// Quick sort implementation for workers
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
    } else if (field === 'nilai') {
      comparison = arr[j].nilai - pivot.nilai;
    }

    if (comparison <= 0) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// Fungsi merge untuk merge sort
function merge(left, right, field) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    let comparison = 0;
    if (field === 'name') {
      comparison = left[leftIndex].name.localeCompare(right[rightIndex].name);
    } else if (field === 'nim') {
      comparison = left[leftIndex].nim.localeCompare(right[rightIndex].nim);
    } else if (field === 'nilai') {
      comparison = left[leftIndex].nilai - right[rightIndex].nilai;
    }

    if (comparison <= 0) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
}

// Implementasi merge sort
function mergeSort(data, field) {
  if (data.length <= 1) {
    return data;
  }

  const middle = Math.floor(data.length / 2);
  const left = data.slice(0, middle);
  const right = data.slice(middle);

  return merge(
    mergeSort(left, field),
    mergeSort(right, field),
    field
  );
}

// Implementasi pencarian linier
function linearSearch(data, query) {
  const results = [];
  
  for (let i = 0; i < data.length; i++) {
    const student = data[i];
    // Cek apakah kueri cocok dengan nama, NIM, atau nilai
    if (
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.nim.includes(query) ||
      (student.nilai !== undefined && student.nilai.toString().includes(query))
    ) {
      results.push(student);
    }
  }
  
  return results;
}