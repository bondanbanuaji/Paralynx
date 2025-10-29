import React from 'react';

const PerformanceSummary = ({ hasil }) => {
  // Check if we have results for both operations
  const hasSortResults = hasil.sort && hasil.sort.sequential && hasil.sort.parallel;
  const hasSearchResults = hasil.search && hasil.search.sequential && hasil.search.parallel;
  
  // Also check for smart results
  const hasSortSmartResults = hasil.sort && hasil.sort.smart;
  const hasSearchSmartResults = hasil.search && hasil.search.smart;
  
  // Calculate metrics if we have complete data
  let sortMetrics = null;
  let searchMetrics = null;
  
  if (hasSortResults) {
    const seqTime = hasil.sort.sequential.time;
    const parTime = hasil.sort.parallel.time;
    const speedup = seqTime / parTime;
    const timeSaved = seqTime - parTime;
    
    sortMetrics = {
      speedup: speedup,
      timeSaved: timeSaved,
      isFaster: parTime < seqTime
    };
  }
  
  if (hasSearchResults) {
    const seqTime = hasil.search.sequential.time;
    const parTime = hasil.search.parallel.time;
    const speedup = seqTime / parTime;
    const timeSaved = seqTime - parTime;
    
    searchMetrics = {
      speedup: speedup,
      timeSaved: timeSaved,
      isFaster: parTime < seqTime
    };
  }
  
  // Format time for display
  const formatWaktu = (waktu) => {
    if (waktu < 1) {
      return `${waktu.toFixed(3)} ms`;
    } else if (waktu < 1000) {
      return `${waktu.toFixed(2)} ms`;
    } else {
      return `${(waktu / 1000).toFixed(2)} s`;
    }
  };
  
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
        Ringkasan Kinerja Paralel
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sort Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            Pengurutan (Sort)
          </h3>
          
          {hasSortResults ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Sequential:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {formatWaktu(hasil.sort.sequential.time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Parallel:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatWaktu(hasil.sort.parallel.time)}
                </span>
              </div>
              {hasSortSmartResults && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Smart:</span>
                  <span className={`font-medium ${hasil.sort.smart.time < Math.min(hasil.sort.sequential.time, hasil.sort.parallel.time) ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {formatWaktu(hasil.sort.smart.time)}
                  </span>
                </div>
              )}
              <div className="pt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${Math.min((hasil.sort.parallel.time/hasil.sort.sequential.time) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Paralel</span>
                  <span>Berurutan</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-gray-600 dark:text-gray-300">Kecepatan Paralel:</span>
                <span className="font-medium text-green-600 dark:text-green-400 ml-2">
                  {sortMetrics.speedup.toFixed(2)}x lebih cepat
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              Jalankan pengurutan berurutan dan paralel untuk melihat statistik
            </p>
          )}
        </div>
        
        {/* Search Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
            Pencarian (Search)
          </h3>
          
          {hasSearchResults ? (
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Sequential:</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {formatWaktu(hasil.search.sequential.time)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Parallel:</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatWaktu(hasil.search.parallel.time)}
                </span>
              </div>
              {hasSearchSmartResults && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Smart:</span>
                  <span className={`font-medium ${hasil.search.smart.time < Math.min(hasil.search.sequential.time, hasil.search.parallel.time) ? 'text-orange-600 dark:text-orange-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {formatWaktu(hasil.search.smart.time)}
                  </span>
                </div>
              )}
              <div className="pt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-purple-500"
                    style={{ width: `${Math.min((hasil.search.parallel.time/hasil.search.sequential.time) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>Paralel</span>
                  <span>Berurutan</span>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-gray-600 dark:text-gray-300">Kecepatan Paralel:</span>
                <span className="font-medium text-green-600 dark:text-green-400 ml-2">
                  {searchMetrics.speedup.toFixed(2)}x lebih cepat
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm italic">
              Jalankan pencarian berurutan dan paralel untuk melihat statistik
            </p>
          )}
        </div>
      </div>
      
      {/* Overall Summary */}
      <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <h4 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Insight Keseluruhan</h4>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          Mode Smart otomatis memilih pendekatan terbaik berdasarkan ukuran data.
          Komputasi paralel memungkinkan pembagian beban kerja ke banyak thread/prosesor,
          sehingga operasi yang intensif komputasi dapat diselesaikan jauh lebih cepat.
          Efek ini lebih terasa pada dataset yang lebih besar karena overhead komunikasi
          antar-proses menjadi sebanding dengan keuntungan paralelisasi.
        </p>
      </div>
    </div>
  );
};

export default PerformanceSummary;