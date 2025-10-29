import React, { useState, useMemo } from 'react';

const DataTable = ({ data, title }) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Jika ini hasil pencarian, datanya mungkin dibungkus dalam objek
  const displayData = useMemo(() => Array.isArray(data) ? data : (data?.result || []), [data]);
  
  // Optimasi untuk dataset besar: batasi item per halaman berdasarkan ukuran dataset
  const itemPerHalaman = useMemo(() => {
    if (displayData.length > 10000) return 100; // Untuk dataset besar, tampilkan lebih banyak per halaman
    if (displayData.length > 1000) return 50;
    return 25; // Untuk dataset kecil, tampilkan lebih sedikit per halaman
  }, [displayData.length]);
  
  const [halamanSaatIni, setHalamanSaatIni] = useState(1);

  // Hitung nilai pagination
  const totalHalaman = useMemo(() => Math.ceil(displayData.length / itemPerHalaman), [displayData.length, itemPerHalaman]);
  const indeksAwal = useMemo(() => (halamanSaatIni - 1) * itemPerHalaman, [halamanSaatIni, itemPerHalaman]);
  const indeksAkhir = useMemo(() => Math.min(indeksAwal + itemPerHalaman, displayData.length), [indeksAwal, itemPerHalaman, displayData.length]);
  const dataSaatIni = useMemo(() => displayData.slice(indeksAwal, indeksAkhir), [displayData, indeksAwal, indeksAkhir]);

  // Tangani perubahan halaman
  const handleUbahHalaman = (halaman) => {
    if (halaman >= 1 && halaman <= totalHalaman) {
      setHalamanSaatIni(halaman);
    }
  };

  // Tangani halaman sebelumnya
  const handleSebelumnya = () => {
    if (halamanSaatIni > 1) {
      setHalamanSaatIni(halamanSaatIni - 1);
    }
  };

  // Tangani halaman selanjutnya
  const handleSelanjutnya = () => {
    if (halamanSaatIni < totalHalaman) {
      setHalamanSaatIni(halamanSaatIni + 1);
    }
  };

  // Informasi khusus untuk dataset besar
  const isBigDataset = displayData.length > 10000;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {title || 'Data Mahasiswa'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Menampilkan {indeksAwal + 1}-{indeksAkhir} dari {displayData.length} data
        </p>
        {isBigDataset && (
          <p className="text-xs text-blue-500 dark:text-blue-400 mt-1 italic">
            Dataset besar terdeteksi - gunakan pagination untuk navigasi efisien
          </p>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                NIM
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {dataSaatIni.map((mahasiswa, index) => {
              const indeksGlobal = indeksAwal + index;
              return (
                <tr 
                  key={mahasiswa.id !== undefined ? mahasiswa.id : indeksGlobal} 
                  className={indeksGlobal % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {indeksGlobal + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {mahasiswa.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {mahasiswa.nim}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Kontrol pagination */}
      {totalHalaman > 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-col sm:flex-row items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300 mb-4 sm:mb-0">
            Halaman <span className="font-medium">{halamanSaatIni}</span> dari <span className="font-medium">{totalHalaman}</span>
            <span className="mx-2">•</span>
            <span className="text-xs">
              {itemPerHalaman} item/hal
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSebelumnya}
              disabled={halamanSaatIni === 1}
              className={`px-3 py-1 rounded-md border ${
                halamanSaatIni === 1 
                  ? 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500'
              }`}
            >
              Sebelumnya
            </button>
            
            {/* Tombol nomor halaman */}
            <div className="flex space-x-1">
              {/* Tampilkan halaman pertama */}
              {totalHalaman > 5 && halamanSaatIni > 3 && (
                <>
                  <button
                    onClick={() => handleUbahHalaman(1)}
                    className={`px-3 py-1 rounded-md border ${
                      halamanSaatIni === 1
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500'
                    }`}
                  >
                    1
                  </button>
                  {halamanSaatIni > 4 && <span className="px-2 py-1 text-gray-500 dark:text-gray-400">...</span>}
                </>
              )}
              
              {/* Tampilkan halaman sekitar halaman saat ini */}
              {Array.from({ length: Math.min(5, totalHalaman) }, (_, i) => {
                // Hitung nomor halaman yang akan ditampilkan
                let nomorHalaman;
                if (totalHalaman <= 5) {
                  nomorHalaman = i + 1;
                } else if (halamanSaatIni <= 3) {
                  nomorHalaman = i + 1;
                } else if (halamanSaatIni >= totalHalaman - 2) {
                  nomorHalaman = totalHalaman - 4 + i;
                } else {
                  nomorHalaman = halamanSaatIni - 2 + i;
                }
                
                if (nomorHalaman >= 1 && nomorHalaman <= totalHalaman) {
                  return (
                    <button
                      key={nomorHalaman}
                      onClick={() => handleUbahHalaman(nomorHalaman)}
                      className={`px-3 py-1 rounded-md border ${
                        halamanSaatIni === nomorHalaman
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500'
                      }`}
                    >
                      {nomorHalaman}
                    </button>
                  );
                }
                return null;
              })}
              
              {/* Tampilkan halaman terakhir */}
              {totalHalaman > 5 && halamanSaatIni < totalHalaman - 2 && (
                <>
                  {halamanSaatIni < totalHalaman - 3 && <span className="px-2 py-1 text-gray-500 dark:text-gray-400">...</span>}
                  <button
                    onClick={() => handleUbahHalaman(totalHalaman)}
                    className={`px-3 py-1 rounded-md border ${
                      halamanSaatIni === totalHalaman
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500'
                    }`}
                  >
                    {totalHalaman}
                  </button>
                </>
              )}
            </div>
            
            <button
              onClick={handleSelanjutnya}
              disabled={halamanSaatIni === totalHalaman}
              className={`px-3 py-1 rounded-md border ${
                halamanSaatIni === totalHalaman 
                  ? 'bg-gray-100 dark:bg-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                  : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500'
              }`}
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;