import React from 'react';

const ResultPanel = ({ seqTime, parTime, operation }) => {
  const bothResultsAvailable =
    seqTime !== null && parTime !== null && seqTime !== undefined && parTime !== undefined;

  let rasioPercepatan = 0;
  let lebihCepat = false;
  let perbedaanWaktu = 0;
  let persentasePerubahan = 0;

  if (bothResultsAvailable) {
    rasioPercepatan = seqTime / parTime;
    lebihCepat = parTime < seqTime;
    perbedaanWaktu = Math.abs(seqTime - parTime);
    persentasePerubahan = ((seqTime - parTime) / seqTime) * 100;
  }

  const formatWaktu = (waktu) => {
    if (waktu === null || waktu === undefined) return '-- ms';
    if (waktu < 1) return `${waktu.toFixed(3)} ms`;
    else if (waktu < 1000) return `${waktu.toFixed(2)} ms`;
    else return `${(waktu / 1000).toFixed(2)} s`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Analisis Kinerja {operation.charAt(0).toUpperCase() + operation.slice(1)}
        </h2>
        {bothResultsAvailable && (
          <div
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              lebihCepat
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
            }`}
          >
            {lebihCepat ? 'Paralel Menang!' : 'Berurutan Menang!'}
          </div>
        )}
      </div>

      {bothResultsAvailable ? (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">Berurutan</span>
              <span className="text-sm font-medium text-black dark:text-white">{formatWaktu(seqTime)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-2">
              <div className="bg-blue-600 h-4 rounded-full" style={{ width: '100%' }}></div>
            </div>

            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-green-600 dark:text-green-400">Paralel</span>
              <span className="text-sm font-medium text-black dark:text-white">{formatWaktu(parTime)}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
              <div
                className={`h-4 rounded-full ${lebihCepat ? 'bg-green-600' : 'bg-red-600'}`}
                style={{ width: `${Math.min((parTime / seqTime) * 100, 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Rasio Percepatan</h4>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {rasioPercepatan.toFixed(2)}x
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Kecepatan paralel dibanding berurutan
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Waktu yang Dihemat</h4>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatWaktu(perbedaanWaktu)}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {lebihCepat ? 'Waktu yang dihemat' : 'Waktu tambahan'}
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Efisiensi</h4>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {Math.abs(persentasePerubahan).toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {lebihCepat ? 'Peningkatan' : 'Penurunan'} kinerja
              </p>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <h5 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Catatan Kinerja</h5>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Hanya satu metode pemrosesan yang telah dijalankan. Jalankan kedua metode untuk memperoleh
            analisis perbandingan kinerja secara lengkap.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
              Pemrosesan Berurutan
            </h3>
            <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded">
              Thread Utama
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatWaktu(seqTime)}</p>
            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
              Waktu yang dibutuhkan menggunakan satu thread
            </p>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-5 border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              Pemrosesan Paralel
            </h3>
            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-200 rounded">
              Web Workers
            </span>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatWaktu(parTime)}
            </p>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Waktu yang dibutuhkan menggunakan banyak thread
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">Insight Kinerja</h5>
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          {bothResultsAvailable ? (
            lebihCepat ? (
              `Pemrosesan paralel selesai ${rasioPercepatan.toFixed(
                2
              )}x lebih cepat dari pemrosesan berurutan. Peningkatan ini terjadi karena pembagian pekerjaan ke banyak thread, memungkinkan eksekusi tugas secara bersamaan dan memanfaatkan semua core CPU secara efektif.`
            ) : (
              `Pemrosesan berurutan lebih cepat dalam kasus ini. Ini mungkin terjadi dengan dataset kecil di mana overhead komunikasi antar thread melebihi keuntungan paralelisasi.`
            )
          ) : (
            `Jalankan kedua metode pemrosesan (berurutan dan paralel) untuk melihat perbandingan kinerja secara lengkap dan insight yang lebih mendalam tentang keunggulan komputasi paralel.`
          )}
        </p>
      </div>
    </div>
  );
};

export default ResultPanel;