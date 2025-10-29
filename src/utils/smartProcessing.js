// Smart processing utility that automatically chooses between sequential and parallel processing
// based on data size and other factors

// Optimized quick sort algorithm for better performance
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

// Optimized linear search with early termination
function linearSearch(data, query, field = null) {
  const hasil = [];
  
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    let matches = false;
    
    if (field && field === 'name') {
      matches = item.name.toLowerCase().includes(query.toLowerCase());
    } else if (field && field === 'nim') {
      matches = item.nim.includes(query);
    } else {
      matches = (
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.nim.includes(query)
      );
    }
    
    if (matches) {
      hasil.push(item);
    }
  }
  
  return hasil;
}

// Utility to determine optimal processing method based on data characteristics
function getProcessingMethod(dataSize, operation) {
  // For small datasets (< 1000), sequential is often faster due to overhead of parallel processing
  // For larger datasets, parallel processing wins
  if (dataSize < 1000) {
    return 'sequential';
  } else if (dataSize < 10000) {
    // For medium datasets, consider the operation type
    return operation === 'sort' ? 'parallel' : 'sequential';
  } else {
    // For large datasets, parallel is generally better
    return 'parallel';
  }
}

// Smart sequential processing with async yielding for large datasets
export async function smartSequentialSort(data, params) {
  const { field } = params;
  const dataArray = [...data];
  
  // For very small datasets, just use built-in sort
  if (data.length < 50) {
    return dataArray.sort((a, b) => {
      if (field === 'name') {
        return a.name.localeCompare(b.name);
      } else if (field === 'nim') {
        return a.nim.localeCompare(b.nim);
      }
      return 0;
    });
  }
  
  // For larger datasets, use quick sort algorithm with async yielding
  const chunkSize = 50; // Process in chunks to prevent blocking
  let processed = 0;
  
  return new Promise((resolve) => {
    function processChunk() {
      const end = Math.min(processed + chunkSize, dataArray.length);
      const subArray = dataArray.slice(processed, end);
      
      // Apply quick sort to this chunk
      quickSort(subArray, field);
      
      // Copy back the sorted chunk
      for (let i = 0; i < subArray.length; i++) {
        dataArray[processed + i] = subArray[i];
      }
      
      processed = end;
      
      if (processed < dataArray.length) {
        // Continue processing in the next frame to avoid blocking
        requestAnimationFrame(processChunk);
      } else {
        // Final global sort after chunk processing
        quickSort(dataArray, field);
        resolve(dataArray);
      }
    }
    
    processChunk();
  });
}

export async function smartSequentialSearch(data, params) {
  const { query } = params;
  
  // Use optimized linear search
  return linearSearch(data, query);
}

// Smart parallel processing with worker management
export async function smartParallelSort(data, params, workerCount = null) {
  const { field } = params;
  
  // If data is small, just use sequential processing
  if (data.length < 1000) {
    return smartSequentialSort(data, params);
  }
  
  // Dynamic worker count based on hardware and data size
  if (!workerCount) {
    workerCount = Math.min(
      navigator.hardwareConcurrency ? Math.max(2, navigator.hardwareConcurrency) : 4,
      Math.min(8, Math.floor(data.length / 500)) // Don't create too many workers for small improvements
    );
  }
  
  // If we only have 1 worker or less, just use sequential
  if (workerCount <= 1) {
    return smartSequentialSort(data, params);
  }
  
  return new Promise((resolve, reject) => {
    const chunkSize = Math.ceil(data.length / workerCount);
    const chunks = [];
    const workers = [];
    let completed = 0;
    const results = [];
    
    // Create chunks
    for (let i = 0; i < workerCount; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, data.length);
      chunks.push(data.slice(start, end));
    }
    
    // Create and start workers
    for (let i = 0; i < chunks.length; i++) {
      const worker = createSortWorker();
      workers.push(worker);
      
      worker.postMessage({
        data: chunks[i],
        field: field
      });
      
      worker.onmessage = (e) => {
        results[i] = e.data.sorted;
        completed++;
        
        if (completed === workers.length) {
          // Merge all sorted chunks
          let finalResult = results[0] || [];
          for (let j = 1; j < results.length; j++) {
            finalResult = mergeSortedArrays(finalResult, results[j], field);
          }
          
          // Clean up workers
          workers.forEach(w => w.terminate());
          resolve(finalResult);
        }
      };
      
      worker.onerror = (error) => {
        workers.forEach(w => w.terminate());
        reject(error);
      };
    }
  });
}

export async function smartParallelSearch(data, params, workerCount = null) {
  const { query } = params;
  
  // If data is small, just use sequential processing
  if (data.length < 1000) {
    return smartSequentialSearch(data, params);
  }
  
  // Dynamic worker count based on hardware and data size
  if (!workerCount) {
    workerCount = Math.min(
      navigator.hardwareConcurrency ? Math.max(2, navigator.hardwareConcurrency) : 4,
      Math.min(8, Math.floor(data.length / 500))
    );
  }
  
  // If we only have 1 worker or less, just use sequential
  if (workerCount <= 1) {
    return smartSequentialSearch(data, params);
  }
  
  return new Promise((resolve, reject) => {
    const chunkSize = Math.ceil(data.length / workerCount);
    const chunks = [];
    const workers = [];
    let completed = 0;
    const results = [];
    
    // Create chunks
    for (let i = 0; i < workerCount; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, data.length);
      chunks.push(data.slice(start, end));
    }
    
    // Create and start workers
    for (let i = 0; i < chunks.length; i++) {
      const worker = createSearchWorker();
      workers.push(worker);
      
      worker.postMessage({
        data: chunks[i],
        query: query
      });
      
      worker.onmessage = (e) => {
        results[i] = e.data.results;
        completed++;
        
        if (completed === workers.length) {
          // Combine all search results
          const finalResult = [];
          for (const resultChunk of results) {
            finalResult.push(...resultChunk);
          }
          
          // Clean up workers
          workers.forEach(w => w.terminate());
          resolve(finalResult);
        }
      };
      
      worker.onerror = (error) => {
        workers.forEach(w => w.terminate());
        reject(error);
      };
    }
  });
}

// Worker factory functions
function createSortWorker() {
  const workerCode = `
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
    
    self.onmessage = function(e) {
      const { data, field } = e.data;
      const sorted = quickSort([...data], field);
      self.postMessage({ sorted });
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

function createSearchWorker() {
  const workerCode = `
    self.onmessage = function(e) {
      const { data, query } = e.data;
      const results = [];
      
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.nim.includes(query)
        ) {
          results.push(item);
        }
      }
      
      self.postMessage({ results });
    };
  `;
  
  const blob = new Blob([workerCode], { type: 'application/javascript' });
  return new Worker(URL.createObjectURL(blob));
}

// Helper to merge two sorted arrays
function mergeSortedArrays(left, right, field) {
  let result = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    let comparison = 0;
    if (field === 'name') {
      comparison = left[leftIndex].name.localeCompare(right[rightIndex].name);
    } else if (field === 'nim') {
      comparison = left[leftIndex].nim.localeCompare(right[rightIndex].nim);
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

// Main smart processing functions that automatically choose the best method
export async function smartSort(data, params) {
  const method = getProcessingMethod(data.length, 'sort');
  
  const startTime = performance.now();
  let result;
  
  if (method === 'sequential') {
    result = await smartSequentialSort([...data], params);
  } else {
    result = await smartParallelSort(data, params);
  }
  
  const endTime = performance.now();
  
  return {
    result,
    time: endTime - startTime,
    method
  };
}

export async function smartSearch(data, params) {
  const method = getProcessingMethod(data.length, 'search');
  
  const startTime = performance.now();
  let result;
  
  if (method === 'sequential') {
    result = await smartSequentialSearch(data, params);
  } else {
    result = await smartParallelSearch(data, params);
  }
  
  const endTime = performance.now();
  
  return {
    result,
    time: endTime - startTime,
    method
  };
}