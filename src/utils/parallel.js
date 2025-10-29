import { detectCpuCores, calculateOptimalWorkers, distributeData, mergeSortedArrays } from './cpuDetection';

// Get the absolute path to the worker file
const getWorkerPath = () => {
  // In Vite, we need to import the worker file to get the correct path
  return new URL('../workers/worker.js', import.meta.url).href;
};

// Optimized parallel sort function with dynamic CPU core detection
export const parallelWorkerSort = (data, params) => {
  return new Promise((resolve, reject) => {
    if (data.length === 0) {
      resolve([]);
      return;
    }

    // Use enhanced CPU detection to determine optimal number of workers
    const numWorkers = calculateOptimalWorkers(data.length);
    
    // For small datasets, use sequential processing to avoid overhead
    if (data.length < 1000 || numWorkers === 1) {
      import('./sequential').then(({ sequentialSort }) => {
        resolve(sequentialSort(data, params));
      }).catch(reject);
      return;
    }

    const chunks = distributeData(data, numWorkers);
    const workers = [];
    let completed = 0;
    const results = new Array(chunks.length);

    // Process each chunk in a worker
    for (let i = 0; i < chunks.length; i++) {
      const worker = new Worker(getWorkerPath());
      workers.push(worker);

      worker.postMessage({
        operation: 'sort',
        data: chunks[i],
        params: params,
        chunkIndex: i,
        operationId: Date.now() + Math.random() // Unique ID for this operation
      });

      worker.onmessage = (e) => {
        results[e.data.chunkIndex] = e.data.result;
        completed++;

        if (completed === chunks.length) {
          // Merge all sorted chunks efficiently
          let finalResult = results[0] || [];
          for (let j = 1; j < results.length; j++) {
            if (results[j]) {
              finalResult = mergeSortedArrays(finalResult, results[j], params.field);
            }
          }

          // Clean up workers
          workers.forEach(w => w.terminate());

          resolve(finalResult);
        }
      };

      worker.onerror = (error) => {
        console.error('Worker error:', error);
        workers.forEach(w => w.terminate());
        reject(error);
      };
    }
  });
};

// Optimized parallel search function with dynamic CPU core detection
export const parallelWorkerSearch = (data, params) => {
  return new Promise((resolve, reject) => {
    if (data.length === 0) {
      resolve([]);
      return;
    }

    // Use enhanced CPU detection to determine optimal number of workers
    const numWorkers = calculateOptimalWorkers(data.length);
    
    // For small datasets, use sequential processing to avoid overhead
    if (data.length < 1000 || numWorkers === 1) {
      import('./sequential').then(({ sequentialSearch }) => {
        resolve(sequentialSearch(data, params));
      }).catch(reject);
      return;
    }

    const chunks = distributeData(data, numWorkers);
    const workers = [];
    let completed = 0;
    const allResults = [];

    // Process each chunk in a worker
    for (let i = 0; i < chunks.length; i++) {
      const worker = new Worker(getWorkerPath());
      workers.push(worker);

      worker.postMessage({
        operation: 'search',
        data: chunks[i],
        params: params,
        chunkIndex: i,
        operationId: Date.now() + Math.random() // Unique ID for this operation
      });

      worker.onmessage = (e) => {
        allResults.push(...e.data.result);
        completed++;

        if (completed === chunks.length) {
          // Clean up workers
          workers.forEach(w => w.terminate());

          resolve(allResults);
        }
      };

      worker.onerror = (error) => {
        console.error('Worker error:', error);
        workers.forEach(w => w.terminate());
        reject(error);
      };
    }
  });
};

// Function to get CPU information for display
export const getCpuInfo = () => {
  const cpuCores = detectCpuCores();
  const optimalWorkers = calculateOptimalWorkers(10000); // Example with 10k items
  
  return {
    cores: cpuCores,
    optimalWorkers: optimalWorkers,
    info: `CPU detected: ${cpuCores} cores, optimal workers for large datasets: ${optimalWorkers}`
  };
};