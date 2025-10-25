import React from 'react';

const ResultPanel = ({ seqTime, parTime, operation }) => {
  // Hitung metrik kinerja
  const rasioPercepatan = seqTime / parTime;
  const lebihCepat = parTime < seqTime;
  const perbedaanWaktu = Math.abs(seqTime - parTime);
  const persentasePerubahan = ((seqTime - parTime) / seqTime) * 100;

  // Format waktu untuk ditampilkan
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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Analisis Kinerja {operation.charAt(0).toUpperCase() + operation.slice(1)}
        </h2>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${lebihCepat ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'}`}>
          {lebihCepat ? 'Paralel Menang!' : 'Berurutan Menang!'}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">Pemrosesan Berurutan</h3>
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
              Thread Utama
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatWaktu(seqTime)}</p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Waktu yang dibutuhkan menggunakan satu thread</p>
          </div>
        </div>
        
        <div className={`bg-${lebihCepat ? 'green' : 'red'}-50 dark:bg-${lebihCepat ? 'green' : 'red'}-900/20 rounded-lg p-5 border border-${lebihCepat ? 'green' : 'red'}-200 dark:border-${lebihCepat ? 'green' : 'red'}-800`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-semibold text-${lebihCepat ? 'green' : 'red'}-800 dark:text-${lebihCepat ? 'green' : 'red'}-200`}>Pemrosesan Paralel</h3>
            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded">
              Web Workers
            </span>
          </div>
          <div className="mt-4">
            <p className={`text-3xl font-bold text-${lebihCepat ? 'green' : 'red'}-600 dark:text-${lebihCepat ? 'green' : 'red'}-400`}>{formatWaktu(parTime)}</p>
            <p className={`text-sm text-${lebihCepat ? 'green' : 'red'}-700 dark:text-${lebihCepat ? 'green' : 'red'}-300 mt-1`}>Waktu yang dibutuhkan menggunakan banyak thread</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Rasio Percepatan</h4>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{rasioPercepatan.toFixed(2)}x</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Waktu berurutan / Waktu paralel
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Waktu yang Dihemat</h4>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatWaktu(perbedaanWaktu)}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {lebihCepat ? 'Lebih cepat dari berurutan' : 'Lebih lambat dari berurutan'}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
          <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Efisiensi</h4>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{Math.abs(persentasePerubahan).toFixed(1)}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {lebihCepat ? 'Peningkatan kinerja' : 'Penurunan kinerja'}
          </p>
        </div>
      </div>
      
      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Insight Kinerja</h5>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          {lebihCepat 
            ? `Pemrosesan paralel selesai ${rasioPercepatan.toFixed(2)}x lebih cepat dari pemrosesan berurutan. Peningkatan ini terjadi karena pembagian pekerjaan ke banyak thread, memungkinkan eksekusi tugas secara bersamaan.`
            : `Pemrosesan berurutan lebih cepat dalam kasus ini. Ini mungkin terjadi dengan dataset kecil di mana overhead paralelisasi melebihi keuntungan kinerja.`}
        </p>
      </div>
    </div>
  );
};

export default ResultPanel;