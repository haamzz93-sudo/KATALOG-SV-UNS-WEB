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

// Metadata khusus terstandarisasi 3 Lini Layanan (1_inovasi: 3 item, 2_produk: 19 item, 3_jasa: 9 item)
const productMeta = {
  // === LINI 1: INOVASI (category_id: 1, total 3 item) ===
  "rabuk-apps-pertanian-cerdas": {
    lini: "teknologi",
    kategoriBadge: "INOVASI",
    headline: "KENAPA INOVASI INI LAYAK DITERAPKAN?",
    tags: ["Sensor Presisi Tanah", "Prediksi Cuaca AI", "Hemat Dosis Pupuk", "Dashboard Terintegrasi"]
  },
  "mesin-double-column-cnc-milling-3-axis": {
    lini: "teknologi",
    kategoriBadge: "INOVASI",
    headline: "KENAPA MESIN INI LAYAK DIPILIH?",
    tags: ["Gantry Dua Kolom Kaku", "Spindle Torsi Tinggi", "Peredam Getaran Optimal", "Toleransi Presisi Mikron"]
  },
  "mesin-cnc-turning-presisi": {
    lini: "teknologi",
    kategoriBadge: "INOVASI",
    headline: "KENAPA MESIN INI LAYAK DIPILIH?",
    tags: ["Bubut Silindris Presisi", "Struktur Besi Cor Kokoh", "Sistem Kontrol Otomatis", "Efisiensi Siklus Produksi"]
  },

  // === LINI 2: PRODUK SIAP TERAP (category_id: 2, total 19 item) ===
  "mofin-umkm-akuntansi-keuangan-web": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA SOFTWARE INI LAYAK DITERAPKAN?",
    tags: ["Standar SAK EMKM", "Laporan Otomatis Real-time", "Multi-User & Hak Akses", "Keamanan Cloud Terjamin"]
  },
  "rintisku-id-software-erp-cloud": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA PLATFORM INI LAYAK DITERAPKAN?",
    tags: ["Manajemen Multi-Cabang", "Otomasi Arus Kas", "Monitoring Inventori POS", "Analitik Bisnis Cerdas"]
  },
  "e-marketplace-umkm-kelurahan": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA SISTEM INI LAYAK DITERAPKAN?",
    tags: ["Katalog Produk Lokal", "Sistem Transaksi Cepat", "Integrasi Kurir Lokal", "Dashboard Pengelola Kelurahan"]
  },
  "sistem-tiket-museum-tahir-foundation": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA SISTEM INI LAYAK DITERAPKAN?",
    tags: ["Validasi QR Code Cepat", "Monitoring Kuota Pengunjung", "Pembayaran Digital QRIS", "Rekap Data Presisi"]
  },
  "sim-bank-sampah-untuk-rakyat": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA SISTEM INI LAYAK DITERAPKAN?",
    tags: ["Pencatatan Timbangan Real-time", "Tabungan Digital Nasabah", "Konversi Poin Rupiah", "Laporan Rekap Otomatis"]
  },
  "sistem-digitalisasi-adminduk-pencatatan-sipil": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA SISTEM INI LAYAK DITERAPKAN?",
    tags: ["Pengarsipan Digital Cepat", "Validasi NIK Aman", "Pencarian Dokumen Kilat", "Standar Enkripsi Aman"]
  },
  "sistem-otomasi-data-survei-rule-based": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA SISTEM INI LAYAK DITERAPKAN?",
    tags: ["Filtering Anomali Cepat", "Rule Engine Kustom", "Visualisasi Grafik Otomatis", "Ekspor Multi-Format"]
  },
  "smart-pest-control-iot-pertanian": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA ALAT INI LAYAK DITERAPKAN?",
    tags: ["Perangkap Tenaga Surya", "Sensor Spektrum Cahaya", "Konektivitas IoT LoRa/WiFi", "Ramah Ekosistem Sawah"]
  },
  "pico-natural-magic-oil-blue-spirulina": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Ekstrak Blue Spirulina Alami", "Tekstur Ringan Cepat Meresap", "Kaya Antioksidan Alami", "100% Bebas Kimia Keras"]
  },
  "herbliss-purple-breeze": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Seduhan Bunga Telang Alami", "Rasa Segar Kaya Antioksidan", "Tanpa Pengawet Buatan", "Kemasan Siap Seduh"]
  },
  "ellevacare-oil-aromaterapi": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Minyak Atsiri Alami Murni", "Aroma Menenangkan Pikiran", "Kemasan Roll-On Praktis", "Formula Lembut di Kulit"]
  },
  "tablet-effervescent-jahe-kunyit": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Larut Cepat Tanpa Ampas", "Ekstrak Jahe & Kunyit Pilihan", "Rasa Hangat di Tubuh", "Standar Mutu Farmasi Vokasi"]
  },
  "suplemen-kapsul-herbal-sehati": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Formulasi Herbal Teruji Lab", "Kapsul Halal Higienis", "Membantu Imunitas Tubuh", "Izin Edar & Mutu Terjamin"]
  },
  "beras-premium-prima-jajar-legowo": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Padi Budidaya Jajar Legowo", "Bulir Utuh Tanpa Pemutih", "Nasi Pulen Aroma Alami", "Kemas Vakum Tahan Lama"]
  },
  "vookies-cookies-biji-nangka": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Tepung Biji Nangka Bergizi", "Renyah Manis Bebas Gluten", "Tinggi Zat Besi & Serat", "Kemasan Pouch Kedap Udara"]
  },
  "snazzle-serundeng-biji-nangka": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Serundeng Renyah Rempah", "Diversifikasi Limbah Nangka", "Gurih Bebas MSG Berlebih", "Lauk Sehat Siap Santap"]
  },
  "jahe-latte-umza": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Perpaduan Jahe Merah & Susu", "Rasa Hangat Creamy Nikmat", "Kemasan Sachet Higienis", "Cocok Kebugaran Tubuh"]
  },
  "produksi-film-animasi-rajamala": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Karakter Maskot Solo", "Kualitas Visual Full HD", "Cerita Edukatif Sarat Nilai", "Pengerjaan Tim Kreatif Ahli"]
  },
  "mixed-hydroxide-precipitate-mhp-powder": {
    lini: "produk",
    kategoriBadge: "PRODUK SIAP TERAP",
    headline: "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Kandungan Nikel Terstandarisasi", "Proses Ekstraksi Presisi", "Kemurnian Bubuk Tinggi", "Bahan Baku Baterai Bersih"]
  },

  // === LINI 3: JASA KONSULTAN & LAYANAN KEAHLIAN (category_id: 3, total 9 item) ===
  "gatc-bim-5d-konstruksi-pelatihan": {
    lini: "jasa",
    kategoriBadge: "JASA & LAYANAN KEAHLIAN",
    headline: "KEUNGGULAN JASA & LAYANAN KEAHLIAN KAMI",
    tags: ["Instruktur Glodon Bersertifikat", "Simulasi Biaya & Waktu 5D", "Sertifikat Internasional Sah", "Kurikulum Standar Industri"]
  },
  "klinik-akuntansi-dan-perpajakan-sv-uns": {
    lini: "jasa",
    kategoriBadge: "JASA & LAYANAN KEAHLIAN",
    headline: "KEUNGGULAN JASA & LAYANAN KEAHLIAN KAMI",
    tags: ["Pendampingan Laporan SPT", "Kepatuhan Pajak UMKM", "Kerahasiaan Data Terjamin", "Dosen & Praktisi Ahli"]
  },
  "pelatihan-sertifikasi-brevet-pajak-ab": {
    lini: "jasa",
    kategoriBadge: "JASA & LAYANAN KEAHLIAN",
    headline: "KEUNGGULAN JASA & LAYANAN KEAHLIAN KAMI",
    tags: ["Silabus Ujian Brevet A & B", "Studi Kasus Pajak Riil", "Sertifikat Terakreditasi", "Modul Praktis Aplikatif"]
  },
  "jasa-layanan-non-destructive-test-ndt": {
    lini: "jasa",
    kategoriBadge: "JASA & LAYANAN KEAHLIAN",
    headline: "KEUNGGULAN JASA & LAYANAN KEAHLIAN KAMI",
    tags: ["Uji Mutu Tanpa Rusak Benda", "Instrumen Ultrasonik Canggih", "Laporan Hasil Uji Akurat", "Personel Level II Resmi"]
  },
  "jasa-alih-media-digital-naskah-kuno": {
    lini: "jasa",
    kategoriBadge: "JASA & LAYANAN KEAHLIAN",
    headline: "KEUNGGULAN JASA & LAYANAN KEAHLIAN KAMI",
    tags: ["Overhead Scanner Presisi", "Resolusi Gambar Sangat Tajam", "Metadata Dublin Core", "Penyelamatan Cagar Budaya"]
  },
  "pengembangan-sistem-perpustakaan-terpadu-rfid": {
    lini: "jasa",
    kategoriBadge: "JASA & LAYANAN KEAHLIAN",
    headline: "KEUNGGULAN JASA & LAYANAN KEAHLIAN KAMI",
    tags: ["Integrasi RFID Gate Cerdas", "Self-Service Peminjaman Buku", "Pelacakan Inventaris Akurat", "SOP Otomasi Perpustakaan"]
  },
  "sap-university-partnership-program-training": {
    lini: "jasa",
    kategoriBadge: "JASA & LAYANAN KEAHLIAN",
    headline: "KEUNGGULAN JASA & LAYANAN KEAHLIAN KAMI",
    tags: ["Akses Server Resmi SAP", "Kurikulum Global Teruji", "Sertifikasi Diakui Industri", "Peluang Karier Korporasi"]
  },
  "bank-benih-sentra-olahan-kedelai-terpadu": {
    lini: "jasa",
    kategoriBadge: "JASA & LAYANAN KEAHLIAN",
    headline: "KEUNGGULAN JASA & LAYANAN KEAHLIAN KAMI",
    tags: ["Varietas Unggul Bersertifikat", "Pelatihan Pasca Panen Petani", "Sentra Olahan Tempe Higienis", "Kemandirian Pangan Terpadu"]
  },
  "wellness-tourism-sv-uns": {
    lini: "jasa",
    kategoriBadge: "JASA & LAYANAN KEAHLIAN",
    headline: "WHY YOU'LL LOVE IT",
    tags: ["Wisata Kebugaran Tradisional", "Terapi Herbal Alami", "Pemandu Wisata Bersertifikat", "Edukasi Jamu Nusantara"]
  }
};

const rawImageMap = {
  "rabuk-apps-pertanian-cerdas": "/images/catalog/rabuk-apps.png",
  "mesin-double-column-cnc-milling-3-axis": "/images/catalog/mesin-cnc-milling.png",
  "mesin-cnc-turning-presisi": "/images/catalog/mesin-cnc-turning.png",
  "mofin-umkm-akuntansi-keuangan-web": "/images/catalog/mofin-umkm.png",
  "rintisku-id-software-erp-cloud": "/images/catalog/rintisku-id.png",
  "e-marketplace-umkm-kelurahan": "/images/catalog/marketplace-umkm.png",
  "sistem-tiket-museum-tahir-foundation": "/images/catalog/tiket-museum-tahir.png",
  "sim-bank-sampah-untuk-rakyat": "/images/catalog/bank-sampah-rakyat.png",
  "sistem-digitalisasi-adminduk-pencatatan-sipil": "/images/catalog/sim-pencatatan-sipil.png",
  "sistem-otomasi-data-survei-rule-based": "/images/catalog/rootroster-otomasi-survei.png",
  "smart-pest-control-iot-pertanian": "/images/catalog/smart-pest-control.png",
  "pico-natural-magic-oil-blue-spirulina": "/images/catalog/pico-natural-magic-oil.png",
  "herbliss-purple-breeze": "/images/catalog/herbliss-purple-breeze.png",
  "ellevacare-oil-aromaterapi": "/images/catalog/ellevacare-oil.png",
  "tablet-effervescent-jahe-kunyit": "/images/catalog/tablet-effervescent.png",
  "suplemen-kapsul-herbal-sehati": "/images/catalog/kapsul-sehati.png",
  "beras-premium-prima-jajar-legowo": "/images/catalog/beras-premium-prima.png",
  "vookies-cookies-biji-nangka": "/images/catalog/vookies-cookies.png",
  "snazzle-serundeng-biji-nangka": "/images/catalog/snazzle-serundeng.png",
  "jahe-latte-umza": "/images/catalog/jahe-latte-umza.png",
  "produksi-film-animasi-rajamala": "/images/catalog/animasi-rajamala.png",
  "mixed-hydroxide-precipitate-mhp-powder": "/images/catalog/mhp-powder.png",
  "gatc-bim-5d-konstruksi-pelatihan": "/images/catalog/bim-gatc-konstruksi.png",
  "klinik-akuntansi-dan-perpajakan-sv-uns": "/images/catalog/klinik-akuntansi-perpajakan.png",
  "pelatihan-sertifikasi-brevet-pajak-ab": "/images/catalog/brevet-pajak-ab.png",
  "jasa-layanan-non-destructive-test-ndt": "/images/catalog/jasa-ndt-material.png",
  "jasa-alih-media-digital-naskah-kuno": "/images/catalog/alih-media-naskah-kuno.png",
  "pengembangan-sistem-perpustakaan-terpadu-rfid": "/images/catalog/sistem-perpustakaan-terpadu.png",
  "sap-university-partnership-program-training": "/images/catalog/sap-training-program.png",
  "bank-benih-sentra-olahan-kedelai-terpadu": "/images/catalog/bank-benih-kedelai.png",
  "wellness-tourism-sv-uns": "/images/catalog/wellness-tourism.png"
};

const itemsWithMeta = rawProducts.map(p => {
  const meta = productMeta[p.slug] || {
    lini: p.category_id === 1 ? "teknologi" : p.category_id === 3 ? "jasa" : "produk",
    kategoriBadge: p.category_id === 1 ? "TEKNOLOGI & DIGITAL" : p.category_id === 3 ? "JASA & LAYANAN KEAHLIAN" : "PRODUK SIAP TERAP",
    headline: p.category_id === 1 ? "KENAPA TEKNOLOGI INI LAYAK DITERAPKAN?" : p.category_id === 3 ? "KEUNGGULAN JASA & LAYANAN KEAHLIAN KAMI" : "KENAPA PRODUK INI LAYAK DIPILIH?",
    tags: ["Standar Mutu Teruji", "Kompetensi Profesional", "Siap Pakai & Berdaya Guna", "Kemitraan DUDI"]
  };
  return {
    ...p,
    rawImageUrl: rawImageMap[p.slug] || p.thumbnail_url,
    metaLini: meta.lini,
    metaKategoriBadge: meta.kategoriBadge,
    metaHeadline: meta.headline,
    metaTags: meta.tags
  };
});

let savedCount = 0;
const totalExpected = itemsWithMeta.length * 4; // 124 photos

const server = http.createServer((req, res) => {
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
    console.log('[SUCCESS] File products_to_seed.json & backend/products_to_seed.json telah disinkronkan!');

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

  // Melayani file gambar statis
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
