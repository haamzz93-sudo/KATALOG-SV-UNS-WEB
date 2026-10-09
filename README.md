# KATALOG BISNIS & INOVASI SEKOLAH VOKASI (UNS)
## Blueprints, Architecture, & Execution Specifications

Repositori/folder ini berisi spesifikasi arsitektur teknis lengkap, skema basis data, pemetaan komponen UI/UX dari 7 referensi dunia, arsitektur Next.js 14+ dengan 3D Scroll, backend Laravel 11 REST API, serta workflow visual asset generation.

Dokumen ini disusun untuk dieksekusi secara presisi oleh **Antigravity IDE** tanpa ambigu, tanpa kode instan yang terpotong (*no AI slop*), dan langsung siap pakai.

---

### Daftar Dokumen Spesifikasi:

1. **[01-SYSTEM-ARCHITECTURE-AND-SPEC.md](file:///D:/Landing%20Page/KATALOG%20UNS/01-SYSTEM-ARCHITECTURE-AND-SPEC.md)**
   * Lingkup proyek ekosistem katalog bisnis & marketplace inovasi Sekolah Vokasi.
   * Model multi-tenant (Super Admin, Pimpinan SV, Admin Prodi).
   * Taksonomi 3 Layanan: **Teknologi SaaS (dengan Live Demo)**, **Produk Fisik/Robotik/IoT**, dan **Jasa**.
   * Identitas visual palet warna: **Biru SV UNS (`#0A2540`), Putih Bersih (`#FFFFFF` / `#F8FAFC`), dan Emas Prestisius (`#C5A059` / `#D4AF37`)**.
   * Standar arsitektur decoupling: Next.js Frontend + Laravel API + MySQL.

2. **[02-BENCHMARK-AND-COMPONENTS-REFERENCE.md](file:///D:/Landing%20Page/KATALOG%20UNS/02-BENCHMARK-AND-COMPONENTS-REFERENCE.md)**
   * Bedah arsitektur UI/UX dan ekstraksi komponen dari 7 referensi web:
     * `frame.work`: Modular exploded hardware, specs drawer, configurator.
     * `apple.com/apple-vision-pro`: Scrollytelling, fixed 3D canvas, text reveal on scroll, technical grid.
     * `stripe.com`: Interactive live demo sandbox, animated code blocks, micro-animations, blue-white-gold styling.
     * `unitree.com`: Robot/IoT spec layout (degrees of freedom, payload, sensors, motors), video modal, RFQ CTA.
     * `toptal.com`: Service catalog, verified team/lab talent cards, trust badge hierarchy.
     * `contra.com`: Project deliverables timeline, package tiers, direct contact modal.
     * `21st.dev`: Bento grid, 3D tilt cards, shimmer buttons, animated tabs.
   * Template kode Tailwind CSS & Framer Motion siap pakai.

3. **[03-DATABASE-SCHEMA-AND-LARAVEL-BACKEND.md](file:///D:/Landing%20Page/KATALOG%20UNS/03-DATABASE-SCHEMA-AND-LARAVEL-BACKEND.md)**
   * Skema DDL MySQL 8.x lengkap (tabel, foreign key, index, enum).
   * Laravel 11 Migrations, Eloquent Models, Relationships, dan Resource Transformers.
   * Database Seeder realistis untuk Sekolah Vokasi (Prodi TIF, Mesin, Elektro) dengan produk seperti Rintisku SaaS, Robot Arvin IoT, dan Software House Vokasi.
   * RESTful API Endpoint specifications lengkap dengan payload JSON Request & Response.

4. **[04-NEXTJS-FRONTEND-ARCHITECTURE-AND-3D.md](file:///D:/Landing%20Page/KATALOG%20UNS/04-NEXTJS-FRONTEND-ARCHITECTURE-AND-3D.md)**
   * Struktur folder Next.js App Router (`app/(public)`, `app/(dashboard)`, `components/3d`, `components/catalog`).
   * Konfigurasi Tailwind CSS custom token warna Biru-Putih-Emas.
   * Implementasi interaktif **3D Scrollytelling** menggunakan Spline Web Component & React Three Fiber (Three.js).
   * Komponen Modal Live Demo Sandbox interaktif untuk kategori SaaS/Teknologi.

5. **[05-IMAGE-AND-MOCKUP-GENERATION-WORKFLOW.md](file:///D:/Landing%20Page/KATALOG%20UNS/05-IMAGE-AND-MOCKUP-GENERATION-WORKFLOW.md)**
   * Pipeline pembuatan aset visual 3D dan mockup produk (Midjourney v6, Flux, Stable Diffusion, Tripo3D, Spline).
   * Prompt presisi siap pakai (*copy-paste*) untuk Robot Arvin IoT, UI SaaS Rintisku, Banner Jasa Software House, dan Hero 3D Vokasi UNS.
   * Standar kompresi aset web (GLB < 3MB, WebP/AVIF) untuk performa scroll 60 FPS.

6. **[06-CANVAS-SCROLL-SEQUENCE-IMPLEMENTATION.md](file:///D:/Landing%20Page/KATALOG%20UNS/06-CANVAS-SCROLL-SEQUENCE-IMPLEMENTATION.md)**
   * Implementasi HTML5 Canvas Scrollytelling ala Apple (Frame-by-frame image sequence).
   * Komponen `CanvasScrollyRobot.tsx` yang mengikat posisi scroll browser dengan rotasi produk 360°.

7. **[07-DYNAMIC-ISLAND-THEME-I18N-AND-VIDEO-DEMO.md](file:///D:/Landing%20Page/KATALOG%20UNS/07-DYNAMIC-ISLAND-THEME-I18N-AND-VIDEO-DEMO.md)**
   * Komponen **Dynamic Island Floating Header** dengan animasi ekspansi Framer Motion.
   * Sistem **Dual Theme** (Default: Light Mode / Putih Bersih + Dark Mode).
   * **Bilingual i18n Switcher** (Bahasa Indonesia sebagai Default + English).
   * **Video Demo Modal Interaktif** untuk showcase video aplikasi web/jasa dengan animasi transisi halus.
   * Data lengkap 5 Elemen (Mockup, Demo, Nama, Spesifikasi, Harga) untuk 3 item Prodi TIF.

8. **[08-SMOOTH-3D-VIDEO-SHOWCASE-SPEC.md](file:///D:/Landing%20Page/KATALOG%20UNS/08-SMOOTH-3D-VIDEO-SHOWCASE-SPEC.md)**
   * Showcase video 3D mulus transparan (`mix-blend-screen`).
   * Rotasi 3 Proyek Unggulan (Robot Arvin IoT, SaaS Rintisku, Vokasi Software House).
   * Sinkronisasi judul, teks subtitle, dan kartu spesifikasi (*callouts*) dinamis saat video berganti.
   * Batas durasi maksimal 30 detik per video dengan progress bar dan tombol navigasi instan.

---

### Panduan Eksekusi di Antigravity IDE:
1. Buka folder `D:\Landing Page\KATALOG UNS` di Antigravity IDE.
2. Inisialisasi frontend:
   ```bash
   npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
   ```
3. Inisialisasi backend Laravel:
   ```bash
   composer create-project laravel/laravel backend
   ```
4. Ikuti instruksi migrasi pada `03-DATABASE-SCHEMA-AND-LARAVEL-BACKEND.md` dan integrasi antarmuka pada `04-NEXTJS-FRONTEND-ARCHITECTURE-AND-3D.md`.
