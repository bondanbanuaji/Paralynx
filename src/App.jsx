import React, { useState, useEffect } from 'react';
import Controls from './components/Controls';
import DataTable from './components/DataTable';
import ResultPanel from './components/ResultPanel';
import PerformanceSummary from './components/PerformanceSummary';
import SystemInfo from './components/SystemInfo';
import { generateStudentData } from './utils/generateData';
import { sequentialSort, sequentialSearch, sequentialSortAsync, sequentialSearchAsync } from './utils/sequential';
import { parallelWorkerSort, parallelWorkerSearch, getCpuInfo } from './utils/parallel';
import { smartSort, smartSearch } from './utils/smartProcessing';

function App() {
  const [mahasiswa, setMahasiswa] = useState([]);
  const [hasil, setHasil] = useState({ sort: null, search: null });
  const [sedangMemuat, setSedangMemuat] = useState(false);
  const [modeGelap, setModeGelap] = useState(false);

  // Toggle mode gelap dan simpan preferensi
  useEffect(() => {
    const isGelap = localStorage.getItem('modeGelap') === 'true';
    setModeGelap(isGelap);
    
    if (isGelap) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleModeGelap = () => {
    const modeBaru = !modeGelap;
    setModeGelap(modeBaru);
    localStorage.setItem('modeGelap', modeBaru);
    
    if (modeBaru) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleGenerateData = (jumlah) => {
    setSedangMemuat(true);
    // Use a more efficient approach for generating large datasets
    const startTime = performance.now();
    const data = generateStudentData(jumlah);
    const generationTime = performance.now() - startTime;
    console.log(`Data generation took ${generationTime}ms for ${jumlah} items`);
    
    setMahasiswa(data);
    setHasil({ sort: null, search: null });
    setSedangMemuat(false);
  };

  // 1. Search Sequential - Optimized to prevent UI blocking
  const handleSearchSequential = async (params) => {
    setSedangMemuat(true);
    try {
      const startTime = performance.now();
      const result = await sequentialSearchAsync(mahasiswa, params);
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      setHasil(prevHasil => ({
        ...prevHasil,
        search: {
          ...prevHasil.search,
          sequential: { result, time: executionTime },
          operation: 'search'
        }
      }));
    } catch (error) {
      console.error('Error in sequential search:', error);
    } finally {
      setSedangMemuat(false);
    }
  };

  // 2. Search Parallel
  const handleSearchParallel = async (params) => {
    setSedangMemuat(true);
    try {
      const startTime = performance.now();
      const result = await parallelWorkerSearch(mahasiswa, params);
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      setHasil(prevHasil => ({
        ...prevHasil,
        search: {
          ...prevHasil.search,
          parallel: { result, time: executionTime },
          operation: 'search'
        }
      }));
    } catch (error) {
      console.error('Error in parallel search:', error);
    } finally {
      setSedangMemuat(false);
    }
  };

  // 3. Sort Sequential - Optimized to prevent UI blocking
  const handleSortSequential = async (params) => {
    setSedangMemuat(true);
    try {
      const startTime = performance.now();
      const result = await sequentialSortAsync([...mahasiswa], params);
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      setHasil(prevHasil => ({
        ...prevHasil,
        sort: {
          ...prevHasil.sort,
          sequential: { result, time: executionTime },
          operation: 'sort'
        }
      }));
    } catch (error) {
      console.error('Error in sequential sort:', error);
    } finally {
      setSedangMemuat(false);
    }
  };

  // 4. Sort Parallel
  const handleSortParallel = async (params) => {
    setSedangMemuat(true);
    try {
      const startTime = performance.now();
      const result = await parallelWorkerSort(mahasiswa, params);
      const endTime = performance.now();
      const executionTime = endTime - startTime;

      setHasil(prevHasil => ({
        ...prevHasil,
        sort: {
          ...prevHasil.sort,
          parallel: { result, time: executionTime },
          operation: 'sort'
        }
      }));
    } catch (error) {
      console.error('Error in parallel sort:', error);
    } finally {
      setSedangMemuat(false);
    }
  };

  // 5. Smart Processing - Automatically chooses best method
  const handleSmartSort = async (params) => {
    setSedangMemuat(true);
    try {
      const result = await smartSort(mahasiswa, params);
      
      setHasil(prevHasil => ({
        ...prevHasil,
        sort: {
          ...prevHasil.sort,
          smart: { result: result.result, time: result.time },
          operation: 'sort'
        }
      }));
    } catch (error) {
      console.error('Error in smart sort:', error);
    } finally {
      setSedangMemuat(false);
    }
  };

  const handleSmartSearch = async (params) => {
    setSedangMemuat(true);
    try {
      const result = await smartSearch(mahasiswa, params);
      
      setHasil(prevHasil => ({
        ...prevHasil,
        search: {
          ...prevHasil.search,
          smart: { result: result.result, time: result.time },
          operation: 'search'
        }
      }));
    } catch (error) {
      console.error('Error in smart search:', error);
    } finally {
      setSedangMemuat(false);
    }
  };

  const handleProsesData = async (operasi, params, type) => {
    if (type === 'sequential') {
      if (operasi === 'sort') {
        await handleSortSequential(params);
      } else if (operasi === 'search') {
        await handleSearchSequential(params);
      }
    } else if (type === 'parallel') {
      if (operasi === 'sort') {
        await handleSortParallel(params);
      } else if (operasi === 'search') {
        await handleSearchParallel(params);
      }
    } else if (type === 'smart') {
      // Use smart processing that automatically chooses the best method
      if (operasi === 'sort') {
        await handleSmartSort(params);
      } else if (operasi === 'search') {
        await handleSmartSearch(params);
      }
    } else {
      // Default: run both sequential and parallel for comparison (existing behavior)
      setSedangMemuat(true);
      try {
        let hasilSeq, hasilPar;

        // Sequential processing
        const seqStartTime = performance.now();
        if (operasi === 'sort') {
          hasilSeq = await sequentialSortAsync([...mahasiswa], params);
        } else if (operasi === 'search') {
          hasilSeq = await sequentialSearchAsync(mahasiswa, params);
        }
        const seqEndTime = performance.now();
        const waktuSeq = seqEndTime - seqStartTime;

        // Parallel processing
        const parStartTime = performance.now();
        if (operasi === 'sort') {
          hasilPar = await parallelWorkerSort(mahasiswa, params);
        } else if (operasi === 'search') {
          hasilPar = await parallelWorkerSearch(mahasiswa, params);
        }
        const parEndTime = performance.now();
        const waktuPar = parEndTime - parStartTime;

        setHasil(prevHasil => ({
          ...prevHasil,
          [operasi]: {
            sequential: { result: hasilSeq, time: waktuSeq },
            parallel: { result: hasilPar, time: waktuPar },
            operation: operasi
          }
        }));
      } catch (error) {
        console.error('Error processing data:', error);
      } finally {
        setSedangMemuat(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Paralynx - Pemrosesan Sequential vs Paralel
          </h1>
          <button
            onClick={toggleModeGelap}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {modeGelap ? 'Mode Terang' : 'Mode Gelap'}
          </button>
        </div>
        
        <SystemInfo />
        
        <Controls 
          onGenerate={handleGenerateData} 
          onProcess={handleProsesData}
          onSortSequential={handleSortSequential}
          onSortParallel={handleSortParallel}
          onSortSmart={handleSmartSort}
          onSearchSequential={handleSearchSequential}
          onSearchParallel={handleSearchParallel}
          onSearchSmart={handleSmartSearch}
          isLoading={sedangMemuat}
        />
        
        {sedangMemuat && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {mahasiswa.length > 0 && (
          <>
            {/* Ringkasan Kinerja */}
            <PerformanceSummary hasil={hasil} />
            
            {/* Hasil Pengurutan */}
            {hasil.sort && (
              <div className="mb-8">
                <ResultPanel 
                  seqTime={hasil.sort.sequential?.time || null}
                  parTime={hasil.sort.parallel?.time || null}
                  smartTime={hasil.sort.smart?.time || null}
                  operation={hasil.sort.operation}
                />
                <DataTable 
                  data={hasil.sort.sequential?.result || hasil.sort.parallel?.result || hasil.sort.smart?.result || []} 
                  title="Hasil Pengurutan" 
                />
              </div>
            )}
            
            {/* Hasil Pencarian */}
            {hasil.search && (
              <div className="mb-8">
                <ResultPanel 
                  seqTime={hasil.search.sequential?.time || null}
                  parTime={hasil.search.parallel?.time || null}
                  smartTime={hasil.search.smart?.time || null}
                  operation={hasil.search.operation}
                />
                <DataTable 
                  data={hasil.search.sequential?.result || hasil.search.parallel?.result || hasil.search.smart?.result || []} 
                  title="Hasil Pencarian" 
                />
              </div>
            )}
            
            {/* Tampilkan data asli jika belum ada operasi */}
            {!hasil.sort && !hasil.search && (
              <DataTable 
                data={mahasiswa} 
                title="Data Mahasiswa" 
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;