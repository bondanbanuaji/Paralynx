import React, { useState, useEffect } from 'react';
import Controls from './components/Controls';
import DataTable from './components/DataTable';
import ResultPanel from './components/ResultPanel';
import { generateStudentData } from './utils/generateData';
import { sequentialSort, sequentialSearch } from './utils/sequential';
import { parallelWorkerSort, parallelWorkerSearch } from './utils/parallel';

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
    setTimeout(() => {
      const data = generateStudentData(jumlah);
      setMahasiswa(data);
      setHasil({ sort: null, search: null });
      setSedangMemuat(false);
    }, 100); // Delay kecil untuk simulasi proses
  };

  const handleProsesData = async (operasi, params) => {
    setSedangMemuat(true);
    
    let hasilSeq, hasilPar;
    
    // Pemrosesan berurutan
    const seqStartTime = performance.now();
    if (operasi === 'sort') {
      hasilSeq = sequentialSort([...mahasiswa], params);
    } else if (operasi === 'search') {
      hasilSeq = sequentialSearch(mahasiswa, params);
    }
    const seqEndTime = performance.now();
    const waktuSeq = seqEndTime - seqStartTime;
    
    // Pemrosesan paralel
    const parStartTime = performance.now();
    if (operasi === 'sort') {
      hasilPar = await parallelWorkerSort(mahasiswa, params);
    } else if (operasi === 'search') {
      hasilPar = await parallelWorkerSearch(mahasiswa, params);
    }
    const parEndTime = performance.now();
    const waktuPar = parEndTime - parStartTime;
    
    setHasil({
      ...hasil,
      [operasi]: {
        sequential: { result: hasilSeq, time: waktuSeq },
        parallel: { result: hasilPar, time: waktuPar },
        operation: operasi
      }
    });
    
    setSedangMemuat(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Paralynx - Pemrosesan Berurutan vs Paralel
          </h1>
          <button
            onClick={toggleModeGelap}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {modeGelap ? 'Mode Terang' : 'Mode Gelap'}
          </button>
        </div>
        
        <Controls 
          onGenerate={handleGenerateData} 
          onProcess={handleProsesData}
          isLoading={sedangMemuat}
        />
        
        {sedangMemuat && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {mahasiswa.length > 0 && (
          <>
            {/* Hasil Pengurutan */}
            {hasil.sort && (
              <div className="mb-8">
                <ResultPanel 
                  seqTime={hasil.sort.sequential.time}
                  parTime={hasil.sort.parallel.time}
                  operation={hasil.sort.operation}
                />
                <DataTable 
                  data={hasil.sort.sequential.result} 
                  title="Hasil Pengurutan" 
                />
              </div>
            )}
            
            {/* Hasil Pencarian */}
            {hasil.search && (
              <div className="mb-8">
                <DataTable 
                  data={hasil.search.sequential.result} 
                  title="Hasil Pencarian" 
                />
                <ResultPanel 
                  seqTime={hasil.search.sequential.time}
                  parTime={hasil.search.parallel.time}
                  operation={hasil.search.operation}
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