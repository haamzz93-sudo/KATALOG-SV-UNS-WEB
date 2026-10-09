# PROMPT EKSEKUSI OTOMATIS ANTIGRAVITY IDE

Salin seluruh teks di dalam blok prompt di bawah ini, lalu tempelkan (*paste*) langsung ke chat panel **Antigravity IDE**.

```text
Halo Antigravity IDE, tolong eksekusi dan bangun secara penuh (fullstack) platform "Katalog Bisnis & Inovasi Sekolah Vokasi UNS Madiun" di folder saat ini (D:\Landing Page\KATALOG UNS) berdasarkan seluruh dokumen spesifikasi teknis (01 s/d 07) yang sudah tersedia.

Jalankan seluruh proses secara mandiri dan otomatis tanpa perlu meminta konfirmasi berulang kali:

1. DATABASE & XAMPP MYSQL:
   - Buat database MySQL lokal di XAMPP dengan nama `katalog_vokasi_uns` (Host: 127.0.0.1, Port: 3306, User: root, Password: "").
   - Jika service MySQL XAMPP belum aktif, beritahu cara singkat atau jalankan script inisialisasinya.

2. BACKEND LARAVEL 11 (folder: `backend`):
   - Inisialisasi proyek Laravel 11 API dengan Laravel Sanctum.
   - Konfigurasi .env ke database MySQL XAMPP `katalog_vokasi_uns`.
   - Terapkan seluruh skema tabel dari file `03-DATABASE-SCHEMA-AND-LARAVEL-BACKEND.md` (roles, prodis, users, categories, catalog_items, catalog_specs, catalog_media, inquiries).
   - Jalankan `php artisan migrate --seed` menggunakan Seeder autentik dari file 03 (memuat data 3 Role: Super Admin, Pimpinan SV, Prodi TIF; serta 3 item: SaaS Rintisku, Robot Arvin v2, dan Vokasi Software House).
   - Buat Resource Controller & REST API endpoint publik dan authenticated.
   - Jalankan backend server: `php artisan serve --port=8000` sebagai proses daemon/background.

3. FRONTEND NEXT.JS 14+ (folder: `frontend`):
   - Inisialisasi Next.js 14+ App Router, TypeScript, Tailwind CSS, Lucide React, dan Framer Motion.
   - Konfigurasi tema warna institusi Biru Navy (#0A2540), Putih (#FFFFFF / #F8FAFC), dan Emas (#C5A059) di `tailwind.config.ts`.
   - Salin seluruh aset yang sudah ada di `public/images/` (logo resmi SV UNS berwarna & putih, background hitam, frame sequence robot 01-03, poster slogan, dan mockup produk).
   - Pasang komponen utama dari file spesifikasi:
     * `DynamicIslandHeader.tsx` dari file 07 (floating pill, switch Light/Dark mode dengan default Light Mode putih bersih, switch bahasa ID/EN dengan default Indonesia, dan logo resmi SV UNS).
     * `CanvasScrollyRobot.tsx` dari file 06 (3D scrollytelling frame-by-frame ala Apple untuk Robot Arvin).
     * `LiveDemoModal.tsx` dari file 02 (interactive sandbox iframe untuk SaaS Rintisku).
     * `VideoDemoModal.tsx` dari file 07 (pemutar video demo interaktif untuk Vokasi Software House).
     * Halaman Publik (Beranda `/`, Katalog `/katalog`, Detail `/katalog/[slug]`).
     * Halaman Dashboard Role-based (Pimpinan SV View-Only Analytics, Admin Prodi Input Item 1-5, Super Admin Kelola Akun).
   - Hubungkan fetch data katalog ke API Laravel (http://127.0.0.1:8000/api/v1/public/catalog).
   - Jalankan frontend dev server: `npm run dev -- -p 3000` sebagai proses daemon/background.

4. HASIL AKHIR:
   - Pastikan kedua server berjalan tanpa error di background.
   - Berikan laporan URL lokal:
     * Frontend: http://localhost:3000
     * Backend API: http://localhost:8000/api/v1/public/catalog
     * Kredensial login akun demo (Super Admin, Pimpinan SV, Admin Prodi TIF).
```
