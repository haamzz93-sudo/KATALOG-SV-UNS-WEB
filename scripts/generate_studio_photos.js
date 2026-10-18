const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 9991;
const ROOT_DIR = path.resolve(__dirname, '..');
const FRONTEND_PUBLIC_DIR = path.resolve(ROOT_DIR, 'frontend', 'public');
const STUDIO_OUTPUT_DIR = path.resolve(FRONTEND_PUBLIC_DIR, 'images', 'catalog', 'studio');
const PRODUCTS_JSON_PATH = path.resolve(ROOT_DIR, 'products_to_seed.json');
const BACKEND_JSON_PATH = path.resolve(ROOT_DIR, 'backend', 'products_to_seed.json');

if (!fs.existsSync(STUDIO_OUTPUT_DIR)) {
  fs.mkdirSync(STUDIO_OUTPUT_DIR, { recursive: true });
}

// 1. Baca data 31 produk
const rawProducts = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'));

// Metadata khusus untuk 31 produk
const productMeta = {
  "rabuk-apps-pertanian-cerdas": {
    kategori: "TEKNOLOGI & DIGITAL",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Sensor Presisi Tanah", "Prediksi Cuaca AI", "Hemat Dosis Pupuk", "Dashboard Terintegrasi"]
  },
  "mesin-double-column-cnc-milling-3-axis": {
    kategori: "MESIN & MANUFAKTUR",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Gantry Dua Kolom Kaku", "Spindle Torsi Tinggi", "Peredam Getaran Optimal", "Toleransi Presisi Mikron"]
  },
  "mesin-cnc-turning-presisi": {
    kategori: "MESIN & MANUFAKTUR",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Bubut Silindris Presisi", "Struktur Besi Cor Kokoh", "Sistem Kontrol Otomatis", "Efisiensi Siklus Produksi"]
  },
  "mofin-umkm-akuntansi-keuangan-web": {
    kategori: "APLIKASI & KEUANGAN",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Standar SAK EMKM", "Laporan Otomatis Real-time", "Multi-User & Hak Akses", "Keamanan Cloud Terjamin"]
  },
  "rintisku-id-software-erp-cloud": {
    kategori: "ERP & SAAS CLOUD",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Manajemen Multi-Cabang", "Otomasi Arus Kas", "Monitoring Inventori POS", "Analitik Bisnis Cerdas"]
  },
  "e-marketplace-umkm-kelurahan": {
    kategori: "PLATFORM DIGITAL UMKM",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Katalog Produk Lokal", "Sistem Transaksi Cepat", "Integrasi Kurir Lokal", "Dashboard Pengelola Kelurahan"]
  },
  "sistem-tiket-museum-tahir-foundation": {
    kategori: "SMART TICKETING",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Validasi QR Code Cepat", "Monitoring Kuota Pengunjung", "Pembayaran Digital QRIS", "Rekap Data Presisi"]
  },
  "sim-bank-sampah-untuk-rakyat": {
    kategori: "SISTEM LINGKUNGAN",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Pencatatan Timbangan Real-time", "Tabungan Digital Nasabah", "Konversi Poin Rupiah", "Laporan Rekap Otomatis"]
  },
  "sistem-digitalisasi-adminduk-pencatatan-sipil": {
    kategori: "E-GOVERNMENT",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Pengarsipan Digital Cepat", "Validasi NIK Aman", "Pencarian Dokumen Kilat", "Standar Enkripsi Aman"]
  },
  "sistem-otomasi-data-survei-rule-based": {
    kategori: "DATA & ANALITIK",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Filtering Anomali Cepat", "Rule Engine Kustom", "Visualisasi Grafik Otomatis", "Ekspor Multi-Format"]
  },
  "smart-pest-control-iot-pertanian": {
    kategori: "IOT & PERTANIAN",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Perangkap Tenaga Surya", "Sensor Spektrum Cahaya", "Konektivitas IoT LoRa/WiFi", "Ramah Ekosistem Sawah"]
  },
  "pico-natural-magic-oil-blue-spirulina": {
    kategori: "SKINCARE HERBAL",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Ekstrak Blue Spirulina Alami", "Tekstur Ringan Cepat Meresap", "Kaya Antioksidan Alami", "100% Bebas Kimia Keras"]
  },
  "herbliss-purple-breeze": {
    kategori: "MINUMAN KESEHATAN",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Seduhan Bunga Telang Alami", "Rasa Segar Kaya Antioksidan", "Tanpa Pengawet Buatan", "Kemasan Siap Seduh"]
  },
  "ellevacare-oil-aromaterapi": {
    kategori: "AROMATERAPI ALAMI",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Minyak Atsiri Alami Murni", "Aroma Menenangkan Pikiran", "Kemasan Roll-On Praktis", "Formula Lembut di Kulit"]
  },
  "tablet-effervescent-jahe-kunyit": {
    kategori: "SUPLEMEN HERBAL",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Larut Cepat Tanpa Ampas", "Ekstrak Jahe & Kunyit Pilihan", "Rasa Hangat di Tubuh", "Standar Mutu Farmasi Vokasi"]
  },
  "suplemen-kapsul-herbal-sehati": {
    kategori: "SUPLEMEN KESEHATAN",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Formulasi Herbal Teruji Lab", "Kapsul Halal Higienis", "Membantu Imunitas Tubuh", "Izin Edar & Mutu Terjamin"]
  },
  "beras-premium-prima-jajar-legowo": {
    kategori: "PANGAN POKOK",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Padi Budidaya Jajar Legowo", "Bulir Utuh Tanpa Pemutih", "Nasi Pulen Aroma Alami", "Kemas Vakum Tahan Lama"]
  },
  "vookies-cookies-biji-nangka": {
    kategori: "MAKANAN BERGIZI",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Tepung Biji Nangka Bergizi", "Renyah Manis Bebas Gluten", "Tinggi Zat Besi & Serat", "Kemasan Pouch Kedap Udara"]
  },
  "snazzle-serundeng-biji-nangka": {
    kategori: "OLAHAN PANGAN SEHAT",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Serundeng Renyah Rempah", "Diversifikasi Limbah Nangka", "Gurih Bebas MSG Berlebih", "Lauk Sehat Siap Santap"]
  },
  "jahe-latte-umza": {
    kategori: "MINUMAN REMPAH",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Perpaduan Jahe Merah & Susu", "Rasa Hangat Creamy Nikmat", "Kemasan Sachet Higienis", "Cocok Kebugaran Tubuh"]
  },
  "produksi-film-animasi-rajamala": {
    kategori: "ANIMASI & MEDIA",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Karakter Maskot Solo", "Kualitas Visual Full HD", "Cerita Edukatif Sarat Nilai", "Pengerjaan Tim Kreatif Ahli"]
  },
  "mixed-hydroxide-precipitate-mhp-powder": {
    kategori: "REKAYASA KIMIA",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Kandungan Nikel Terstandarisasi", "Proses Ekstraksi Presisi", "Kemurnian Bubuk Tinggi", "Bahan Baku Baterai Bersih"]
  },
  "gatc-bim-5d-konstruksi-pelatihan": {
    kategori: "PELATIHAN KONSTRUKSI",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Integrasi Model BIM 5D", "Simulasi Biaya & Waktu Presisi", "Instruktur Bersertifikat", "Kurikulum Standar Proyek"]
  },
  "klinik-akuntansi-dan-perpajakan-sv-uns": {
    kategori: "KONSULTASI BISNIS",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Pendampingan Laporan Keuangan", "Kepatuhan Pajak UMKM", "Kerahasiaan Data Terjamin", "Dosen & Praktisi Ahli"]
  },
  "pelatihan-sertifikasi-brevet-pajak-ab": {
    kategori: "SERTIFIKASI PROFESI",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Silabus Ujian Brevet A & B", "Studi Kasus Pajak Nyata", "Sertifikat Terakreditasi", "Modul Praktis Aplikatif"]
  },
  "jasa-layanan-non-destructive-test-ndt": {
    kategori: "PENGUJIAN MATERIAL",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Uji Tanpa Merusak Struktur", "Alat Ultrasonik Mutakhir", "Laporan Hasil Uji Akurat", "Personel Level II Resmi"]
  },
  "jasa-alih-media-digital-naskah-kuno": {
    kategori: "PRESERVASI ARSIP",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Scanner Khusus Kertas Tua", "Resolusi Gambar Sangat Tajam", "Metadata Standar Internasional", "Penyelamatan Cagar Budaya"]
  },
  "pengembangan-sistem-perpustakaan-terpadu-rfid": {
    kategori: "SMART RFID LIBRARY",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Integrasi RFID Gate Cerdas", "Self-Service Peminjaman Buku", "Pelacakan Inventaris Akurat", "Terhubung Database Sentral"]
  },
  "sap-university-partnership-program-training": {
    kategori: "PELATIHAN ENTERPRISE",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Akses Server Asli SAP", "Kurikulum Resmi Global", "Sertifikasi Diakui Industri", "Peluang Karier Korporasi"]
  },
  "bank-benih-sentra-olahan-kedelai-terpadu": {
    kategori: "AGRIBISNIS KEDELAI",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Varietas Unggul Benih Kedelai", "Daya Tumbuh & Hasil Tinggi", "Pendampingan Pasca Panen", "Kemandirian Pangan Nasional"]
  },
  "wellness-tourism-sv-uns": {
    kategori: "WELLNESS TOURISM",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Wisata Kebugaran Holistik", "Terapi Herbal Tradisional", "Pemandu Bersertifikasi Wisata", "Pengalaman Relaksasi Alami"]
  }
};

const itemsWithMeta = rawProducts.map(p => {
  const meta = productMeta[p.slug] || {
    kategori: "PRODUK INOVASI",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Kualitas Teruji Lab", "Desain Presisi", "Kemasan Siap Pasar", "Solutif & Berdaya Guna"]
  };
  return {
    ...p,
    metaKategori: meta.kategori,
    metaHeadline: meta.headline,
    metaTags: meta.tags
  };
});

let savedCount = 0;
const totalExpected = itemsWithMeta.length * 4; // 124 photos

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/api/products') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(itemsWithMeta));
    return;
  }

  if (req.url === '/api/save-photo' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { slug, photoIndex, photoId, dataUrl } = JSON.parse(body);
        const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
        const filename = `${slug}-${photoIndex}-${photoId}.jpg`;
        const filepath = path.join(STUDIO_OUTPUT_DIR, filename);
        fs.writeFileSync(filepath, Buffer.from(base64Data, 'base64'));

        savedCount++;
        console.log(`[${savedCount}/${totalExpected}] Saved: ${filename}`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, filename }));
      } catch (err) {
        console.error('Error saving photo:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  if (req.url === '/api/done' && req.method === 'POST') {
    console.log('\n[SUCCESS] Semua 124 Foto Studio Marketplace berhasil dibuat dan disimpan!');
    
    // Perbarui products_to_seed.json
    const updatedProducts = rawProducts.map(p => {
      const heroUrl = `/images/catalog/studio/${p.slug}-1-hero.jpg`;
      const detailUrl = `/images/catalog/studio/${p.slug}-2-detail.jpg`;
      const infografisUrl = `/images/catalog/studio/${p.slug}-3-infografis.jpg`;
      const lifestyleUrl = `/images/catalog/studio/${p.slug}-4-lifestyle.jpg`;

      return {
        ...p,
        thumbnail_url: heroUrl,
        gallery: [
          heroUrl,
          detailUrl,
          infografisUrl,
          lifestyleUrl
        ]
      };
    });

    fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(updatedProducts, null, 2), 'utf8');
    fs.writeFileSync(BACKEND_JSON_PATH, JSON.stringify(updatedProducts, null, 2), 'utf8');
    console.log('[SUCCESS] File products_to_seed.json & backend/products_to_seed.json telah diperbarui dengan 4 foto studio untuk ke-31 inovasi!');

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, count: savedCount }));

    setTimeout(() => {
      console.log('Menutup server generator...');
      server.close();
      process.exit(0);
    }, 1500);
    return;
  }

  if (req.url === '/' || req.url === '/runner.html') {
    const runnerHtmlPath = path.join(__dirname, 'runner.html');
    if (fs.existsSync(runnerHtmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(fs.readFileSync(runnerHtmlPath, 'utf8'));
      return;
    }
  }

  // Melayani file gambar statis dari frontend/public
  const cleanUrl = req.url.split('?')[0];
  const filePath = path.join(FRONTEND_PUBLIC_DIR, cleanUrl.replace(/^\//, ''));
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server Generator Studio berjalan di http://localhost:${PORT}`);
  console.log(`Memulai proses Chrome headless untuk 31 produk (${totalExpected} foto)...`);

  const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
  const browserBin = fs.existsSync(chromePath) ? chromePath : edgePath;

  const chromeArgs = [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    `http://localhost:${PORT}/runner.html`
  ];

  const browserProc = spawn(browserBin, chromeArgs);

  browserProc.on('error', (err) => {
    console.error('Gagal menjalankan browser:', err);
  });

  browserProc.on('exit', (code) => {
    console.log(`Browser selesai dengan exit code: ${code}`);
  });
});
