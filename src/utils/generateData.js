// Database nama Indonesia
const namaIndonesia = [
  'Budi', 'Siti', 'Andi', 'Rina', 'Agus', 'Dewi', 'Rudi', 'Lina', 'Joko', 'Sri',
  'Ahmad', 'Mila', 'Bambang', 'Yuni', 'Santoso', 'Ani', 'Hendra', 'Maya', 'Dodi', 'Tina',
  'Eko', 'Ratna', 'Fajar', 'Wati', 'Guntur', 'Kartika', 'Hadi', 'Nurul', 'Imam', 'Lia',
  'Joni', 'Murni', 'Kusuma', 'Ratih', 'Lukman', 'Siska', 'Maman', 'Tuti', 'Nana', 'Vina',
  'Oki', 'Winda', 'Putra', 'Citra', 'Rahmat', 'Dina', 'Samuel', 'Eva', 'Taufik', 'Yani',
  'Ujang', 'Zulaika', 'Asep', 'Rini', 'Benny', 'Siska', 'Chandra', 'Tari', 'Dedy', 'Umi',
  'Edi', 'Vera', 'Ferry', 'Wulan', 'Gani', 'Yessi', 'Hardi', 'Zakiyah', 'Iwan', 'Ayu',
  'Jamal', 'Kartini', 'Krisna', 'Laras', 'Maulana', 'Mira', 'Nur', 'Niken', 'Oman', 'Opik',
  'Pandu', 'Putri', 'Qomar', 'Ratman', 'Sigit', 'Tari', 'Umar', 'Vivi', 'Wawan', 'Xena',
  'Yusuf', 'Zaki', 'Amin', 'Bella', 'Cici', 'Doni', 'Ela', 'Fani', 'Gilang', 'Happy'
];

// Fungsi untuk menghasilkan NIM acak 10 digit
const generateNIM = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

// Fungsi untuk menghasilkan nama Indonesia acak
const generateRandomName = () => {
  return namaIndonesia[Math.floor(Math.random() * namaIndonesia.length)];
};

// Fungsi untuk menghasilkan data mahasiswa
export const generateStudentData = (jumlah) => {
  const mahasiswa = [];
  
  for (let i = 0; i < jumlah; i++) {
    mahasiswa.push({
      id: i,
      name: generateRandomName(),
      nim: generateNIM()
    });
  }
  
  return mahasiswa;
};

// Ekspor database nama untuk penggunaan potensial di modul lain
export { namaIndonesia };