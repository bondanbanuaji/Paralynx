/**
 * CPU Detection and Worker Management Utility
 * Detects available CPU cores and manages Web Workers accordingly
 */

// Enhanced CPU detection with fallbacks
export const detectCpuCores = () => {
  // Primary method: Use navigator.hardwareConcurrency
  if (navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency;
  }
  
  // Fallback 1: Try to detect using performance timing
  try {
    // Create a simple benchmark to estimate cores
    const start = performance.now();
    const testArray = new Array(1000000).fill(1);
    const sum = testArray.reduce((a, b) => a + b, 0);
    const end = performance.now();
    const time = end - start;
    
    // Rough estimation based on performance (not exact, but better than random)
    if (time < 10) return 8; // Very fast, likely 8+ cores
    if (time < 20) return 6;  // Fast, likely 6 cores
    if (time < 40) return 4;  // Moderate, likely 4 cores
    return 2; // Slow, assume 2 cores
  } catch (e) {
    console.warn('CPU core detection fallback failed, using default value', e);
  }
  
  // Ultimate fallback
  return 4; // Conservative default
};

// Calculate optimal number of workers based on data size and CPU cores
export const calculateOptimalWorkers = (dataSize) => {
  const cpuCores = detectCpuCores();
  
  // For small datasets, limit workers to avoid overhead
  if (dataSize < 1000) {
    return 1; // Use single thread for small datasets
  }
  
  // For medium datasets
  if (dataSize < 10000) {
    return Math.min(2, cpuCores);
  }
  
  // For larger datasets, use more workers but cap at CPU cores
  const calculatedWorkers = Math.min(
    cpuCores, 
    Math.max(2, Math.floor(dataSize / 5000)) // Ensure at least 2 workers for large datasets
  );
  
  return calculatedWorkers;
};

// Create a worker pool based on CPU detection
export const createWorkerPool = async (operation, numWorkers) => {
  const workers = [];
  
  // Create a worker script
  const createWorkerScript = (op) => {
    if (op === 'sort') {
      return `
        // Enhanced sort worker with better partitioning
        self.onmessage = function(e) {
          const { data, field, operationId } = e.data;
          
          // Record start time for performance tracking
          const startTime = performance.now();
          
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
          
          const sorted = quickSort([...data], field);
          const endTime = performance.now();
          const executionTime = endTime - startTime;
          
          self.postMessage({ 
            sorted, 
            operationId,
            executionTime,
            chunkIndex: e.data.chunkIndex
          });
        };
      `;
    } else if (op === 'search') {
      return `
        // Enhanced search worker
        self.onmessage = function(e) {
          const { data, query, operationId } = e.data;
          
          // Record start time for performance tracking
          const startTime = performance.now();
          
          const results = [];
          
          for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (
              item.name.toLowerCase().includes(query.toLowerCase()) ||
              item.nim.includes(query) ||
              (item.nilai !== undefined && item.nilai.toString().includes(query))
            ) {
              results.push(item);
            }
          }
          
          const endTime = performance.now();
          const executionTime = endTime - startTime;
          
          self.postMessage({ 
            results, 
            operationId,
            executionTime,
            chunkIndex: e.data.chunkIndex
          });
        };
      `;
    }
    return '';
  };

  // Create specified number of workers
  for (let i = 0; i < numWorkers; i++) {
    const workerCode = createWorkerScript(operation);
    if (workerCode) {
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      workers.push(new Worker(URL.createObjectURL(blob)));
    }
  }
  
  return workers;
};

// Helper function to distribute data across workers
export const distributeData = (data, numWorkers) => {
  if (numWorkers <= 1) {
    return [data]; // Single chunk for single worker or no parallelization
  }
  
  const chunkSize = Math.ceil(data.length / numWorkers);
  const chunks = [];
  
  for (let i = 0; i < numWorkers; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, data.length);
    if (start < data.length) {
      chunks.push(data.slice(start, end));
    }
  }
  
  return chunks;
};

// Helper function to merge sorted arrays efficiently
export const mergeSortedArrays = (left, right, field) => {
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
};