import React, { useState } from 'react';

const Controls = ({ onGenerate, onProcess, isLoading }) => {
  const [jumlahData, setJumlahData] = useState(1000);
  const [kueriCari, setKueriCari] = useState('');
  const [urutkanBerdasarkan, setUrutkanBerdasarkan] = useState('name');

  const handleGenerate = () => {
    onGenerate(parseInt(jumlahData));
  };

  const handleSort = () => {
    onProcess('sort', { field: urutkanBerdasarkan });
  };

  const handleSearch = () => {
    if (!kueriCari.trim()) return;
    onProcess('search', { query: kueriCari.trim() });
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
          max="100000"
          className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Generate Data
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            <button
              onClick={handleSort}
              disabled={isLoading || jumlahData === 0}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pengurutan Berurutan vs Paralel
            </button>
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
            <button
              onClick={handleSearch}
              disabled={isLoading || !kueriCari.trim() || jumlahData === 0}
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pencarian Berurutan vs Paralel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Controls;