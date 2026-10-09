# 01. SYSTEM ARCHITECTURE & REQUIREMENTS SPECIFICATION

Dokumen ini mendefinisikan arsitektur sistem, peran pengguna (*role-based access control*), aturan bisnis 3 lini layanan, standar warna institusional (Biru-Putih-Emas), serta batas integrasi sistem untuk platform **Katalog Bisnis & Inovasi Sekolah Vokasi (UNS)**.

---

## 1. Arsitektur Tingkat Tinggi (High-Level Architecture)

Sistem menggunakan pendekatan **Decoupled Headless Architecture**:

```
+-----------------------------------------------------------------------------------+
|                           CLIENT TIER (Next.js 14+)                               |
|  - App Router, TypeScript, Tailwind CSS, Framer Motion, Spline / Three.js R3F     |
|  - Server-Side Rendering (SSR) untuk SEO Katalog Publik                           |
|  - Client-Side Rendering (CSR) untuk 3D Interactive Canvas & Live Demo Sandbox    |
|  - Dashboard Internal (Super Admin, Pimpinan SV, Admin Prodi)                     |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          | REST API (JSON / HTTPS)
                                          | Sanctum Bearer Token Auth
                                          v
+-----------------------------------------------------------------------------------+
|                         BACKEND SERVICES TIER (Laravel 11)                        |
|  - RESTful API Resource Controller                                                |
|  - Policy & Role Gate Authorization (Super Admin, Pimpinan SV, Prodi)             |
|  - Media Storage Handler (S3 / Local Storage untuk Gambar & Mockup)               |
|  - Caching Layer (Redis / Laravel Cache) untuk Katalog Publik                     |
+-----------------------------------------+-----------------------------------------+
                                          |
                                          | PDO / MySQL Driver
                                          v
+-----------------------------------------------------------------------------------+
|                           PERSISTENCE TIER (MySQL 8.x)                            |
|  - InnoDB Storage Engine, Strict UTF8MB4                                          |
|  - Foreign Key Constraints & Database Indexing                                    |
+-----------------------------------------------------------------------------------+
```

---

## 2. Model Multi-Tenant & Hak Akses Pengguna (RBAC)

Platform membagi hak akses ke dalam **3 Peran Utama**:

| Role | Lingkup Wewenang | Kemampuan Sistem |
| :--- | :--- | :--- |
| **Super Admin** | Tingkat Vokasi / Administrator Pusat | - CRUD akun (tambah, edit, nonaktifkan akun Prodi & Pimpinan).<br>- CRUD seluruh master data (kategori, prodi, spesifikasi template).<br>- Moderasi & approval produk dari prodi (publish/draft/archive).<br>- Konfigurasi global situs (hero banner, pengumuman, audit log). |
| **Pimpinan SV** | Dekanat / Direktur Sekolah Vokasi | - **View Only (Read-Only)**.<br>- Akses ke Executive Dashboard & Analytics (jumlah produk per prodi, produk paling banyak dilihat, jumlah klik live demo).<br>- Export laporan katalog (PDF / Excel) untuk akreditasi & mitra DUDI. |
| **Admin Prodi** | Program Studi (cth: D3/D4 TIF, Mesin, Elektro) | - Mengelola katalog **milik program studinya saja**.<br>- Tambah, ubah, hapus item di **3 Layanan** (Teknologi, Produk Fisik, Jasa).<br>- Mengisi detail item: Foto mockup, Link Live Demo, Spesifikasi teknis, Harga, dan Kontak PIC Dosen/Mahasiswa. |

---

## 3. Taksonomi & Logika 3 Lini Layanan

Setiap item yang dimasukkan oleh Prodi wajib diklasifikasikan ke salah satu dari **3 Lini Layanan**:

### A. Layanan 1: TEKNOLOGI (SaaS, Mobile App, Web Platform, AI Engine)
* **Contoh Kasus:** *SaaS Rintisku, SIM Laboratorium Vokasi, Computer Vision Attendance System*.
* **Field Wajib:**
  1. `nama_produk`: Nama platform/software.
  2. `live_demo_url`: URL demo langsung (bisa disematkan ke dalam Interactive Sandbox Modal / iframe aman).
  3. `foto_mockup`: Mockup antarmuka resolusi tinggi (16:9 atau device mockup).
  4. `spesifikasi`: Tech stack (Framework, Database, Cloud Provider, Arsitektur), Minimum System Requirements, API Docs link.
  5. `harga`: Skema langganan (Freemium, Per-User/Bulan, atau Sekali Beli/Lisensi Institusi).

### B. Layanan 2: PRODUK FISIK (Robotika, Hardware IoT, Mesin Manufaktur, Alat Terapan)
* **Contoh Kasus:** *Robot Arvin (Robot Patroli Vokasi), Mesin CNC Mini Router, Smart Agriculture IoT Box*.
* **Field Wajib:**
  1. `nama_produk`: Nama alat/robot/hardware.
  2. `model_3d_asset`: File GLB/GLTF 3D atau URL embed Spline 3D (opsional untuk efek 3D scrollytelling).
  3. `foto_mockup`: Foto studio produk fisik & render meledak (*exploded view components*).
  4. `spesifikasi`: Dimensi (P x L x T), Bobot, Derajat Kebebasan (DOF), Sensor, Baterai/Power, Mikrokontroler (ESP32/STM32/Raspberry Pi).
  5. `harga`: Harga unit per prototipe atau estimasi pesanan produksi per batch.

### C. Layanan 3: JASA (Software House, Desain CAD/CAM, Servis Kalibrasi, Konsultasi IT)
* **Contoh Kasus:** *Jasa Pengembangan Software Prodi TIF, Jasa Uji Material Teknik Mesin, Konsultasi Audit Jaringan*.
* **Field Wajib:**
  1. `nama_jasa`: Nama paket layanan.
  2. `profil_tim_pic`: Dosen pembina, mahasiswa pengembang, lab vokasi pelaksana.
  3. `foto_mockup`: Portofolio pekerjaan sebelumnya / infografis alur jasa.
  4. `spesifikasi`: Lingkup pekerjaan (*scope of work*), deliverables, estimasi lama pengerjaan (SLA).
  5. `harga`: Estimasi tarif dasar (Mulai dari Rp X) atau skema *Request for Quotation (RFQ)*.

---

## 4. Standar Identitas Visual (Design System)

Berdasarkan arahan bahwa website harus memiliki warna dominan **Biru, Putih, dan Emas**, dengan karakteristik **animasi halus, mudah digunakan, dan nyaman**:

### Palet Warna Institusional (HEX & Tailwind Mapping):

```css
/* Color Tokens */
:root {
  /* BIRU (Otoritas Akademik, Teknologi, Kepercayaan) */
  --uns-blue-primary: #0A2540;      /* Deep Midnight Blue (Hero background, Header) */
  --uns-blue-accent: #0F4C81;       /* Royal Blue UNS (Card highlights, Primary Buttons) */
  --uns-blue-subtle: #EBF4FC;       /* Soft Blue Tint (Card backgrounds, Tags) */

  /* PUTIH & NETRAL (Kebersihan, Legibilitas, Ruang Negatif Nyaman) */
  --uns-white: #FFFFFF;             /* Pure White (Card bodies, clean canvas) */
  --uns-bg-surface: #F8FAFC;        /* Slate 50 (App background for zero eye-strain) */
  --uns-border: #E2E8F0;            /* Slate 200 (Clean divider lines) */
  --uns-text-dark: #0F172A;         /* Slate 900 (High contrast readability) */
  --uns-text-muted: #64748B;        /* Slate 500 (Specifications, timestamps) */

  /* EMAS (Prestasi Vokasi, Akreditasi Unggul, Aksen Mewah) */
  --uns-gold-primary: #C5A059;      /* Metallic Muted Gold (Featured Badge, Star Rating, Border Glow) */
  --uns-gold-light: #F5E8C7;        /* Champagne Gold (Badge highlight background) */
  --uns-gold-glow: rgba(197, 160, 89, 0.25); /* 3D Card Hover Shadow */
}
```

### Karakteristik Desain:
* **Anti AI Slop:** Hindari layout acak yang terlalu padat atau efek partikel berlebihan yang memberatkan laptop. Gunakan struktur **Bento Grid** bersih dengan hierarki visual yang jelas.
* **Logo Resmi Sekolah Vokasi (UNS):**
  * **Light Mode:** Menggunakan logo resmi berwarna (`/images/brand/logo-sv-uns-official-color.png`) dengan lingkaran biru, lambang centang oranye SV, dan teks resmi Sekolah Vokasi Universitas Sebelas Maret.
  * **Dark Mode & Footer Gelap:** Menggunakan logo resmi outline putih monokrom (`/images/brand/logo-sv-uns-official-white.png`) dengan lambang UNS dan teks Sekolah Vokasi.
* **Scroll Animation:** Animasi masuk menggunakan *stagger fade-up* lembut (durasi 0.5s - 0.7s) dengan `framer-motion`.
* **Kenyamanan Membaca:** Tipografi menggunakan kombinasi modern font sans-serif seperti `Plus Jakarta Sans` atau `Inter` untuk memastikan dokumen spesifikasi teknis terbaca jelas.

---

## 5. Alur Data Transaksi (Tahap 1 vs Tahap 2)

* **Tahap 1 (Fokus Saat Ini - Poin 1 s/d 5):**
  * Katalog interaktif, filter prodi, modal 3D & Live Demo, spesifikasi teknis lengkap, dan informasi harga.
  * Tombol CTA: *"Coba Live Demo"*, *"Unduh Spesifikasi Teknis (PDF)"*, dan *"Hubungi Prodi (WhatsApp / Email PIC)"*.
* **Tahap 2 (Menyusul):**
  * Checkout keranjang, integrasi Payment Gateway (Midtrans/Xendit/VA Bank), sistem penerbitan invoice resmi kerja sama DUDI dengan Sekolah Vokasi.
