import React, { useState } from 'react';

const Controls = ({ onGenerate, onProcess, onSortSequential, onSortParallel, onSearchSequential, onSearchParallel, onSortSmart, onSearchSmart, isLoading }) => {
  const [jumlahData, setJumlahData] = useState(1000);
  const [kueriCari, setKueriCari] = useState('');
  const [urutkanBerdasarkan, setUrutkanBerdasarkan] = useState('name');

  const handleGenerate = () => {
    onGenerate(parseInt(jumlahData));
  };

  const handleSortSequential = () => {
    onSortSequential({ field: urutkanBerdasarkan });
  };

  const handleSortParallel = () => {
    onSortParallel({ field: urutkanBerdasarkan });
  };

  const handleSortSmart = () => {
    onSortSmart({ field: urutkanBerdasarkan });
  };

  const handleSearchSequential = () => {
    if (!kueriCari.trim()) return;
    onSearchSequential({ query: kueriCari.trim() });
  };

  const handleSearchParallel = () => {
    if (!kueriCari.trim()) return;
    onSearchParallel({ query: kueriCari.trim() });
  };

  const handleSearchSmart = () => {
    if (!kueriCari.trim()) return;
    onSearchSmart({ query: kueriCari.trim() });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Jumlah Data
        </label>
        <input
          type="number"
          value={jumlahData}
          onChange={(e) => setJumlahData(e.target.value)}
          min="1"
          max="1000000" // Increased max to 1 million
          className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <div className="flex space-x-3 mt-4">
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate Data
          </button>
          <button
            onClick={() => {
              setJumlahData(1000);
              onGenerate(1000); // Generate with default value
            }}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kontrol Pengurutan */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Operasi Pengurutan</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Urutkan Berdasarkan
              </label>
              <select
                value={urutkanBerdasarkan}
                onChange={(e) => setUrutkanBerdasarkan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 dark:bg-gray-600 dark:text-white"
              >
                <option value="name">Nama</option>
                <option value="nim">NIM</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleSortSequential}
                disabled={isLoading || jumlahData === 0}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  'Seq'
                )}
              </button>
              <button
                onClick={handleSortParallel}
                disabled={isLoading || jumlahData === 0}
                className="px-3 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  'Par'
                )}
              </button>
              <button
                onClick={handleSortSmart}
                disabled={isLoading || jumlahData === 0}
                className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  'Smart'
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Kontrol Pencarian */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Operasi Pencarian</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Kueri Pencarian
              </label>
              <input
                type="text"
                value={kueriCari}
                onChange={(e) => setKueriCari(e.target.value)}
                placeholder="Masukkan nama atau NIM"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-600 dark:text-white"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleSearchSequential}
                disabled={isLoading || !kueriCari.trim() || jumlahData === 0}
                className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  'Seq'
                )}
              </button>
              <button
                onClick={handleSearchParallel}
                disabled={isLoading || !kueriCari.trim() || jumlahData === 0}
                className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  'Par'
                )}
              </button>
              <button
                onClick={handleSearchSmart}
                disabled={isLoading || !kueriCari.trim() || jumlahData === 0}
                className="px-3 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-1 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                ) : (
                  'Smart'
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Information Panel */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Informasi</h3>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
            <p><strong>Sequential:</strong> Proses di thread utama, cocok untuk data kecil (&lt;1000).</p>
            <p><strong>Parallel:</strong> Proses di Web Workers, efisien untuk data besar.</p>
            <p><strong>Smart:</strong> Otomatis memilih metode terbaik berdasarkan ukuran data.</p>
            <p className="mt-3 text-xs italic">Uji hingga jutaan data tanpa membuat browser crash!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;