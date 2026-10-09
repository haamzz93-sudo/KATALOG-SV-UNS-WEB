# 03. DATABASE SCHEMA & LARAVEL 11 BACKEND API SPECIFICATION

Dokumen ini berisi definisi skema basis data **MySQL 8.x**, migrasi Laravel 11, model Eloquent dengan relasi, seeder data autentik Sekolah Vokasi (UNS), dan dokumentasi endpoint RESTful API lengkap.

---

## 1. Entity Relationship Diagram (ERD Logic)

```
[roles] 1 --- < [users] > --- 0..1 [prodis]
                   |                   |
                   | (audits)          | 1
                   v                   v
             [audit_logs]       [catalog_items] < --- 1 [categories]
                                       |
                   +-------------------+-------------------+
                   | 1                 | 1                 | 1
                   v <                 v <                 v <
            [catalog_specs]     [catalog_media]       [inquiries]
```

---

## 2. Skema DDL MySQL 8.x & Laravel Migrations

### A. Tabel Utama: `roles`, `prodis`, `users`

```php
// database/migrations/2026_09_26_000001_create_roles_and_prodis_tables.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique(); // super_admin, pimpinan_sv, prodi
            $table->string('label', 100);
            $table->timestamps();
        });

        Schema::create('prodis', function (Blueprint $table) {
            $table->id();
            $table->string('kode_prodi', 20)->unique(); // cth: D3-TIF, D4-RPL, D3-TM
            $table->string('nama_prodi', 150);
            $table->string('jenjang', 10)->default('D3'); // D3, D4
            $table->string('fakultas_sekolah', 100)->default('Sekolah Vokasi');
            $table->string('kontak_email', 100)->nullable();
            $table->string('kontak_wa', 30)->nullable();
            $table->string('logo_url')->nullable();
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('prodi_id')->nullable()->constrained('prodis')->nullOnDelete();
            $table->string('name', 150);
            $table->string('email', 150)->unique();
            $table->string('password');
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('users');
        Schema::dropIfExists('prodis');
        Schema::dropIfExists('roles');
    }
};
```

---

### B. Tabel Katalog: `categories`, `catalog_items`, `catalog_specs`, `catalog_media`, `inquiries`

```php
// database/migrations/2026_09_26_000002_create_catalog_tables.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique(); // teknologi, produk, jasa
            $table->string('nama', 100);
            $table->text('deskripsi')->nullable();
            $table->string('icon_name', 50)->default('Box');
            $table->timestamps();
        });

        Schema::create('catalog_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prodi_id')->constrained('prodis')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('nama_item', 200);
            $table->string('slug', 220)->unique();
            $table->string('tagline', 255)->nullable();
            $table->text('deskripsi_singkat');
            $table->longText('deskripsi_lengkap');
            
            // Kolom Khusus Layanan
            $table->string('live_demo_url', 500)->nullable(); // Khusus Teknologi/SaaS
            $table->string('model_3d_url', 500)->nullable();   // Khusus Robot/IoT (Spline/GLB)
            
            // Visual & Status
            $table->string('thumbnail_url', 500);
            $table->enum('status_publikasi', ['draft', 'published', 'archived'])->default('published');
            
            // Harga & Transaksi Tahap 1
            $table->enum('harga_tipe', ['fixed', 'starting_at', 'contact_us'])->default('starting_at');
            $table->decimal('harga_nominal', 15, 2)->default(0.00);
            
            // Kontak PIC / Laboratorium
            $table->string('pic_nama', 150);
            $table->string('pic_kontak', 50); // No WA
            $table->string('pic_laboratorium', 150)->nullable();

            // Metrik untuk Dashboard Pimpinan SV
            $table->unsignedBigInteger('view_count')->default(0);
            $table->unsignedBigInteger('demo_click_count')->default(0);
            $table->unsignedBigInteger('inquiry_count')->default(0);

            $table->timestamps();
            
            $table->index(['category_id', 'status_publikasi']);
            $table->index(['prodi_id', 'status_publikasi']);
        });

        Schema::create('catalog_specs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_item_id')->constrained('catalog_items')->cascadeOnDelete();
            $table->string('group_name', 100)->default('General'); // cth: 'Tech Stack', 'Hardware', 'SLA'
            $table->string('spec_key', 100);   // cth: 'Framework', 'DOF', 'Waktu Pengerjaan'
            $table->text('spec_value');        // cth: 'Next.js 14 + Laravel', '12 Derajat', '14 Hari'
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        Schema::create('catalog_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_item_id')->constrained('catalog_items')->cascadeOnDelete();
            $table->string('file_url', 500);
            $table->enum('media_type', ['image', 'video', 'glb'])->default('image');
            $table->boolean('is_primary')->default(false);
            $table->string('caption', 200)->nullable();
            $table->timestamps();
        });

        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_item_id')->constrained('catalog_items')->cascadeOnDelete();
            $table->string('nama_pengunjung', 150);
            $table->string('instansi', 150); // Industri/Perusahaan mitra
            $table->string('email', 150);
            $table->string('no_wa', 50);
            $table->text('pesan');
            $table->enum('status', ['unread', 'responded', 'deal'])->default('unread');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('inquiries');
        Schema::dropIfExists('catalog_media');
        Schema::dropIfExists('catalog_specs');
        Schema::dropIfExists('catalog_items');
        Schema::dropIfExists('categories');
    }
};
```

---

## 3. Database Seeder Realistis (Konteks SV UNS)

```php
// database/seeders/VocationalCatalogSeeder.php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class VocationalCatalogSeeder extends Seeder {
    public function run(): void {
        // 1. Roles
        $superAdminId = DB::table('roles')->insertGetId([
            'name' => 'super_admin',
            'label' => 'Super Administrator SV',
            'created_at' => now(),
        ]);
        $pimpinanId = DB::table('roles')->insertGetId([
            'name' => 'pimpinan_sv',
            'label' => 'Pimpinan Sekolah Vokasi (View Only)',
            'created_at' => now(),
        ]);
        $prodiRoleId = DB::table('roles')->insertGetId([
            'name' => 'prodi',
            'label' => 'Administrator Program Studi',
            'created_at' => now(),
        ]);

        // 2. Program Studi
        $tifId = DB::table('prodi_id')->insertGetId ?? DB::table('prodis')->insertGetId([
            'kode_prodi' => 'D3-TIF',
            'nama_prodi' => 'D3 Teknik Informatika',
            'jenjang' => 'D3',
            'fakultas_sekolah' => 'Sekolah Vokasi UNS',
            'kontak_email' => 'tif@vokasi.uns.ac.id',
            'kontak_wa' => '6281234567890',
            'created_at' => now(),
        ]);

        $mesinId = DB::table('prodis')->insertGetId([
            'kode_prodi' => 'D3-TM',
            'nama_prodi' => 'D3 Teknik Mesin',
            'jenjang' => 'D3',
            'fakultas_sekolah' => 'Sekolah Vokasi UNS',
            'kontak_email' => 'mesin@vokasi.uns.ac.id',
            'kontak_wa' => '6281234567891',
            'created_at' => now(),
        ]);

        // 3. User Accounts (Contoh 3 Peran)
        DB::table('users')->insert([
            [
                'name' => 'Admin Vokasi Pusat',
                'email' => 'superadmin@vokasi.uns.ac.id',
                'password' => Hash::make('vokasi_super_2026'),
                'role_id' => $superAdminId,
                'prodi_id' => null,
                'created_at' => now(),
            ],
            [
                'name' => 'Dekanat Sekolah Vokasi',
                'email' => 'pimpinan@vokasi.uns.ac.id',
                'password' => Hash::make('pimpinan_sv_2026'),
                'role_id' => $pimpinanId,
                'prodi_id' => null,
                'created_at' => now(),
            ],
            [
                'name' => 'Admin Prodi TIF',
                'email' => 'admin.tif@vokasi.uns.ac.id',
                'password' => Hash::make('tif_vokasi_2026'),
                'role_id' => $prodiRoleId,
                'prodi_id' => $tifId,
                'created_at' => now(),
            ],
        ]);

        // 4. Categories (3 Layanan Wajib)
        $catTekno = DB::table('categories')->insertGetId([
            'slug' => 'teknologi',
            'nama' => 'Teknologi & SaaS',
            'deskripsi' => 'Perangkat lunak, aplikasi web, platform SaaS, dan solusi AI kampus dengan akses live demo interaktif.',
            'created_at' => now(),
        ]);
        $catProduk = DB::table('categories')->insertGetId([
            'slug' => 'produk',
            'nama' => 'Produk Fisik & IoT',
            'deskripsi' => 'Alat robotika, manufaktur mekatronika, perangkat embedded IoT karya laboratorium terapan.',
            'created_at' => now(),
        ]);
        $catJasa = DB::table('categories')->insertGetId([
            'slug' => 'jasa',
            'nama' => 'Jasa & Konsultasi',
            'deskripsi' => 'Jasa pengembangan sistem perangkat lunak, permesinan presisi, pengujian lab, dan konsultasi industri.',
            'created_at' => now(),
        ]);

        // 5. Item Nyata: Teknologi SaaS Rintisku (Prodi TIF)
        $item1Id = DB::table('catalog_items')->insertGetId([
            'prodi_id' => $tifId,
            'category_id' => $catTekno,
            'nama_item' => 'Rintisku - SaaS Inkubasi Bisnis Mahasiswa',
            'slug' => 'rintisku-saas-inkubasi-bisnis',
            'tagline' => 'Platform All-in-One Manajemen Portofolio & Pitching Startup Kampus',
            'deskripsi_singkat' => 'Software as a Service untuk memantau perkembangan validasi produk rintisan mahasiswa vokasi.',
            'deskripsi_lengkap' => 'Rintisku menyediakan modul lean canvas terintegrasi, tracker milestone keuangan, dan penjadwalan pitching mitra industri DUDI secara otomatis.',
            'live_demo_url' => 'https://rintisku-demo.vokasi.uns.ac.id',
            'thumbnail_url' => '/images/catalog/rintisku-mockup.webp',
            'harga_tipe' => 'starting_at',
            'harga_nominal' => 2500000.00,
            'pic_nama' => 'Dr. Darmawan, M.T. & Tim Riset TIF',
            'pic_kontak' => '6281234567890',
            'pic_laboratorium' => 'Lab Software Engineering & AI',
            'status_publikasi' => 'published',
            'view_count' => 1240,
            'demo_click_count' => 380,
            'created_at' => now(),
        ]);

        // Spesifikasi Rintisku
        DB::table('catalog_specs')->insert([
            ['catalog_item_id' => $item1Id, 'group_name' => 'Tech Stack', 'spec_key' => 'Frontend', 'spec_value' => 'Next.js 14 App Router, Tailwind CSS', 'order_index' => 1],
            ['catalog_item_id' => $item1Id, 'group_name' => 'Tech Stack', 'spec_key' => 'Backend API', 'spec_value' => 'Laravel 11 RESTful API + Redis Caching', 'order_index' => 2],
            ['catalog_item_id' => $item1Id, 'group_name' => 'Deployment', 'spec_key' => 'Infrastruktur', 'spec_value' => 'Dockerized on Cloudflare & AWS RDS', 'order_index' => 3],
        ]);

        // 6. Item Nyata: Robot Arvin IoT (Prodi TIF / Mekatronika)
        $item2Id = DB::table('catalog_items')->insertGetId([
            'prodi_id' => $tifId,
            'category_id' => $catProduk,
            'nama_item' => 'Robot Patroli Otonom "Arvin v2"',
            'slug' => 'robot-patroli-otonom-arvin-v2',
            'tagline' => 'Robot Keamanan Indoor-Outdoor dengan Sensor LiDAR 360° & Edge AI Vision',
            'deskripsi_singkat' => 'Robot otonom patroli cerdas untuk pengawasan area gedung, deteksi intrusi, dan pelaporan anomali.',
            'deskripsi_lengkap' => 'Arvin v2 dirancang dengan konstruksi aluminium kokoh, kemampuan navigasi SLAM mandiri tanpa kabel, dan transmisi streaming video terenkripsi.',
            'live_demo_url' => null,
            'model_3d_url' => 'https://my.spline.design/arvinrobot-embed/',
            'thumbnail_url' => '/images/catalog/arvin-robot.webp',
            'harga_tipe' => 'fixed',
            'harga_nominal' => 45000000.00,
            'pic_nama' => 'Arvin (Mahasiswa) & Lab Embedded Vokasi',
            'pic_kontak' => '6281234567892',
            'pic_laboratorium' => 'Laboratorium IoT & Robotika Cerdas',
            'status_publikasi' => 'published',
            'view_count' => 2890,
            'demo_click_count' => 0,
            'created_at' => now(),
        ]);

        // Spesifikasi Robot Arvin
        DB::table('catalog_specs')->insert([
            ['catalog_item_id' => $item2Id, 'group_name' => 'Hardware', 'spec_key' => 'Prosesor Edge', 'spec_value' => 'NVIDIA Jetson Orin Nano 8GB', 'order_index' => 1],
            ['catalog_item_id' => $item2Id, 'group_name' => 'Hardware', 'spec_key' => 'Sensor Navigasi', 'spec_value' => 'RPLiDAR A2M8 360° + Depth Camera Intel RealSense', 'order_index' => 2],
            ['catalog_item_id' => $item2Id, 'group_name' => 'Daya', 'spec_key' => 'Baterai & Daya Tahan', 'spec_value' => 'LiFePO4 24V 20Ah (Operasional 6-8 Jam Mandiri)', 'order_index' => 3],
        ]);

        // 7. Item Nyata: Jasa Pengembangan Software (Prodi TIF)
        $item3Id = DB::table('catalog_items')->insertGetId([
            'prodi_id' => $tifId,
            'category_id' => $catJasa,
            'nama_item' => 'Vokasi Software House - Jasa Pengembangan Sistem Web & Mobile',
            'slug' => 'vokasi-software-house-web-mobile',
            'tagline' => 'Solusi Digitalisasi Industri, Sistem Informasi Manajemen, & Custom ERP',
            'deskripsi_singkat' => 'Layanan pembuatan software teruji industri yang dibina oleh dosen pakar dan mahasiswa berprestasi.',
            'deskripsi_lengkap' => 'Paket layanan mencakup tahapan Product Requirement Document (PRD), perancangan UI/UX Figma, pengembangan kode standar CI/CD, pengujian penetrasi (Pentest), dan pemeliharaan server.',
            'live_demo_url' => null,
            'thumbnail_url' => '/images/catalog/software-house.webp',
            'harga_tipe' => 'starting_at',
            'harga_nominal' => 15000000.00,
            'pic_nama' => 'Unit Bisnis Mahasiswa TIF UNS',
            'pic_kontak' => '6281234567893',
            'pic_laboratorium' => 'Studio Digital Terapan Vokasi',
            'status_publikasi' => 'published',
            'view_count' => 950,
            'demo_click_count' => 0,
            'created_at' => now(),
        ]);

        DB::table('catalog_specs')->insert([
            ['catalog_item_id' => $item3Id, 'group_name' => 'Layanan', 'spec_key' => 'Deliverables', 'spec_value' => 'Source Code Git, Lisensi Penuh, Dokumentasi API', 'order_index' => 1],
            ['catalog_item_id' => $item3Id, 'group_name' => 'Layanan', 'spec_key' => 'Estimasi Pengerjaan', 'spec_value' => '30 - 60 Hari Kerja per Sprint', 'order_index' => 2],
            ['catalog_item_id' => $item3Id, 'group_name' => 'Garansi', 'spec_key' => 'Masa Pemeliharaan', 'spec_value' => 'Free Bug Fixing 3 Bulan Pasca Rilis', 'order_index' => 3],
        ]);
    }
}
```

---

## 4. Spesifikasi RESTful API Endpoints

### Public Endpoints (Tanpa Token):
* `GET /api/v1/public/categories` -> Daftar 3 layanan utama.
* `GET /api/v1/public/catalog` -> Daftar produk terpublikasi (Support query params: `?category=teknologi&prodi=D3-TIF&search=robot&page=1`).
* `GET /api/v1/public/catalog/{slug}` -> Detail lengkap item produk + spesifikasi + galeri media.
* `POST /api/v1/public/catalog/{id}/demo-click` -> Increment klik demo (analitik).
* `POST /api/v1/public/inquiries` -> Kirim formulir minat/RFQ dari calon mitra DUDI.

### Role: Admin Prodi (Bearer Token):
* `GET /api/v1/prodi/my-items` -> List produk milik prodi yang sedang login.
* `POST /api/v1/prodi/items` -> Tambah item baru di 3 layanan.
* `PUT /api/v1/prodi/items/{id}` -> Perbarui item & spesifikasi teknis.
* `DELETE /api/v1/prodi/items/{id}` -> Hapus / arsipkan produk prodi.

### Role: Pimpinan SV (Bearer Token - View Only):
* `GET /api/v1/pimpinan/dashboard-stats` -> Ringkasan metrik (Total produk terdaftar, distribusi per 3 layanan, prodi paling produktif, total impresi & inquiry DUDI).
* `GET /api/v1/pimpinan/export-report` -> Generate dokumen laporan rekap inovasi.

### Role: Super Admin (Bearer Token):
* `GET /api/v1/admin/users` & `POST /api/v1/admin/users` -> Kelola akun Prodi & Pimpinan.
* `PATCH /api/v1/admin/items/{id}/status` -> Moderasi publikasi item prodi.
