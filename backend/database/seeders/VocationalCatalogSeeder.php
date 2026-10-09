<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class VocationalCatalogSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Roles
        $superAdminRoleId = DB::table('roles')->insertGetId([
            'name' => 'super_admin',
            'label' => 'Super Administrator SV',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $pimpinanRoleId = DB::table('roles')->insertGetId([
            'name' => 'pimpinan_sv',
            'label' => 'Pimpinan Sekolah Vokasi (View Only)',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $prodiRoleId = DB::table('roles')->insertGetId([
            'name' => 'prodi',
            'label' => 'Administrator Program Studi',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 2. Program Studi (5 Prodi Resmi Sekolah Vokasi UNS)
        $aktId = DB::table('prodis')->insertGetId([
            'kode_prodi' => 'D3-AKT',
            'nama_prodi' => 'D3 Akuntansi',
            'jenjang' => 'D3',
            'fakultas_sekolah' => 'Sekolah Vokasi UNS',
            'kontak_email' => 'akuntansi@vokasi.uns.ac.id',
            'kontak_wa' => '6281234567801',
            'logo_url' => '/images/brand/logo-sv-uns-official-color.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $tifId = DB::table('prodis')->insertGetId([
            'kode_prodi' => 'D3-TIF',
            'nama_prodi' => 'D3 Teknik Informatika',
            'jenjang' => 'D3',
            'fakultas_sekolah' => 'Sekolah Vokasi UNS',
            'kontak_email' => 'tif@vokasi.uns.ac.id',
            'kontak_wa' => '6281234567890',
            'logo_url' => '/images/brand/logo-sv-uns-official-color.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $trpId = DB::table('prodis')->insertGetId([
            'kode_prodi' => 'D4-TRP',
            'nama_prodi' => 'Sarjana Terapan Teknologi Rekayasa Pangan',
            'jenjang' => 'Sarjana Terapan',
            'fakultas_sekolah' => 'Sekolah Vokasi UNS',
            'kontak_email' => 'trp@vokasi.uns.ac.id',
            'kontak_wa' => '6281234567802',
            'logo_url' => '/images/brand/logo-sv-uns-official-color.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $k3Id = DB::table('prodis')->insertGetId([
            'kode_prodi' => 'D4-K3',
            'nama_prodi' => 'Sarjana Terapan Kesehatan dan Keselamatan Kerja',
            'jenjang' => 'Sarjana Terapan',
            'fakultas_sekolah' => 'Sekolah Vokasi UNS',
            'kontak_email' => 'k3@vokasi.uns.ac.id',
            'kontak_wa' => '6281234567803',
            'logo_url' => '/images/brand/logo-sv-uns-official-color.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $tikaId = DB::table('prodis')->insertGetId([
            'kode_prodi' => 'D4-TIKA',
            'nama_prodi' => 'Sarjana Terapan Teknologi Informasi dan Kecerdasan Artifisial',
            'jenjang' => 'Sarjana Terapan',
            'fakultas_sekolah' => 'Sekolah Vokasi UNS',
            'kontak_email' => 'tika@vokasi.uns.ac.id',
            'kontak_wa' => '6281234567804',
            'logo_url' => '/images/brand/logo-sv-uns-official-color.png',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 3. User Accounts (3 Roles)
        DB::table('users')->insert([
            [
                'name' => 'admin',
                'email' => 'admin@vokasi.uns.ac.id',
                'password' => Hash::make('admin'),
                'role_id' => $superAdminRoleId,
                'prodi_id' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin Vokasi Pusat',
                'email' => 'superadmin@vokasi.uns.ac.id',
                'password' => Hash::make('vokasi_super_2026'),
                'role_id' => $superAdminRoleId,
                'prodi_id' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Dekanat Sekolah Vokasi',
                'email' => 'pimpinan@vokasi.uns.ac.id',
                'password' => Hash::make('pimpinan_sv_2026'),
                'role_id' => $pimpinanRoleId,
                'prodi_id' => null,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin D3 Akuntansi',
                'email' => 'admin.akuntansi@vokasi.uns.ac.id',
                'password' => Hash::make('akuntansi_2026'),
                'role_id' => $prodiRoleId,
                'prodi_id' => $aktId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin Prodi TIF',
                'email' => 'admin.tif@vokasi.uns.ac.id',
                'password' => Hash::make('tif_vokasi_2026'),
                'role_id' => $prodiRoleId,
                'prodi_id' => $tifId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin Rekayasa Pangan',
                'email' => 'admin.trp@vokasi.uns.ac.id',
                'password' => Hash::make('trp_vokasi_2026'),
                'role_id' => $prodiRoleId,
                'prodi_id' => $trpId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin K3 Vokasi',
                'email' => 'admin.k3@vokasi.uns.ac.id',
                'password' => Hash::make('k3_vokasi_2026'),
                'role_id' => $prodiRoleId,
                'prodi_id' => $k3Id,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin AI & IT Vokasi',
                'email' => 'admin.tika@vokasi.uns.ac.id',
                'password' => Hash::make('tika_vokasi_2026'),
                'role_id' => $prodiRoleId,
                'prodi_id' => $tikaId,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // 4. Categories (3 Layanan Wajib)
        $catTekno = DB::table('categories')->insertGetId([
            'slug' => 'teknologi',
            'nama' => 'Teknologi & SaaS',
            'deskripsi' => 'Perangkat lunak, aplikasi web, platform SaaS, dan solusi AI kampus dengan akses live demo interaktif.',
            'icon_name' => 'Laptop',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $catProduk = DB::table('categories')->insertGetId([
            'slug' => 'produk',
            'nama' => 'Produk Fisik & IoT',
            'deskripsi' => 'Alat robotika, manufaktur mekatronika, perangkat embedded IoT karya laboratorium terapan.',
            'icon_name' => 'Cpu',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $catJasa = DB::table('categories')->insertGetId([
            'slug' => 'jasa',
            'nama' => 'Jasa & Konsultasi',
            'deskripsi' => 'Jasa pengembangan sistem perangkat lunak, permesinan presisi, pengujian lab, dan konsultasi industri.',
            'icon_name' => 'Wrench',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // 5. Item 1: Teknologi SaaS Rintisku
        $item1Id = DB::table('catalog_items')->insertGetId([
            'prodi_id' => $tifId,
            'category_id' => $catTekno,
            'nama_item' => 'Rintisku - SaaS Inkubasi Bisnis Mahasiswa',
            'slug' => 'rintisku-saas-inkubasi-bisnis',
            'tagline' => 'Platform All-in-One Manajemen Portofolio & Pitching Startup Kampus',
            'deskripsi_singkat' => 'Software as a Service untuk memantau perkembangan validasi produk rintisan mahasiswa vokasi.',
            'deskripsi_lengkap' => 'Rintisku menyediakan modul lean canvas terintegrasi, tracker milestone keuangan, dan penjadwalan pitching mitra industri DUDI secara otomatis.',
            'live_demo_url' => 'https://rintisku-demo.vokasi.uns.ac.id',
            'model_3d_url' => null,
            'thumbnail_url' => '/images/catalog/rintisku-saas-showcase.jpg',
            'status_publikasi' => 'published',
            'harga_tipe' => 'starting_at',
            'harga_nominal' => 2500000.00,
            'pic_nama' => 'Dr. Darmawan, M.T. & Tim Riset TIF',
            'pic_kontak' => '6281234567890',
            'pic_laboratorium' => 'Lab Software Engineering & AI',
            'view_count' => 1240,
            'demo_click_count' => 380,
            'inquiry_count' => 14,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('catalog_specs')->insert([
            ['catalog_item_id' => $item1Id, 'group_name' => 'Tech Stack', 'spec_key' => 'Frontend', 'spec_value' => 'Next.js 14 App Router, Tailwind CSS', 'order_index' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item1Id, 'group_name' => 'Tech Stack', 'spec_key' => 'Backend API', 'spec_value' => 'Laravel 11 RESTful API + Redis Caching', 'order_index' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item1Id, 'group_name' => 'Deployment', 'spec_key' => 'Infrastruktur', 'spec_value' => 'Dockerized on Cloudflare & AWS RDS', 'order_index' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item1Id, 'group_name' => 'Fitur Utama', 'spec_key' => 'Modul Terpadu', 'spec_value' => 'Lean Canvas Builder, Milestone Tracker, DUDI Pitching Scheduler', 'order_index' => 4, 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('catalog_media')->insert([
            ['catalog_item_id' => $item1Id, 'file_url' => '/images/catalog/rintisku-saas-showcase.jpg', 'media_type' => 'image', 'is_primary' => true, 'caption' => 'Mockup Antarmuka SaaS Rintisku', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 6. Item 2: Robot Patroli Otonom IoT
        $item2Id = DB::table('catalog_items')->insertGetId([
            'prodi_id' => $tifId,
            'category_id' => $catProduk,
            'nama_item' => 'Robot Patroli Otonom',
            'slug' => 'robot-patroli-otonom',
            'tagline' => 'Robot Keamanan Indoor-Outdoor dengan Sensor LiDAR 360° & Edge AI Vision',
            'deskripsi_singkat' => 'Robot otonom patroli cerdas untuk pengawasan area gedung, deteksi intrusi, dan pelaporan anomali.',
            'deskripsi_lengkap' => 'Robot patroli otonom ini dirancang dengan konstruksi aluminium kokoh, kemampuan navigasi SLAM mandiri tanpa kabel, dan transmisi streaming video terenkripsi.',
            'live_demo_url' => null,
            'model_3d_url' => null,
            'thumbnail_url' => '/images/sequence/robot-frame-01.jpg',
            'status_publikasi' => 'published',
            'harga_tipe' => 'fixed',
            'harga_nominal' => 45000000.00,
            'pic_nama' => 'Tim Riset Mahasiswa & Lab Embedded Vokasi',
            'pic_kontak' => '6281234567892',
            'pic_laboratorium' => 'Laboratorium IoT & Robotika Cerdas',
            'view_count' => 2890,
            'demo_click_count' => 0,
            'inquiry_count' => 32,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('catalog_specs')->insert([
            ['catalog_item_id' => $item2Id, 'group_name' => 'Hardware', 'spec_key' => 'Prosesor Edge', 'spec_value' => 'NVIDIA Jetson Orin Nano 8GB', 'order_index' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item2Id, 'group_name' => 'Hardware', 'spec_key' => 'Sensor Navigasi', 'spec_value' => 'RPLiDAR A2M8 360° + Depth Camera Intel RealSense', 'order_index' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item2Id, 'group_name' => 'Daya', 'spec_key' => 'Baterai & Daya Tahan', 'spec_value' => 'LiFePO4 24V 20Ah (Operasional 6-8 Jam Mandiri)', 'order_index' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item2Id, 'group_name' => 'Mobilitas', 'spec_key' => 'Sistem Roda', 'spec_value' => 'Mecanum Omni-wheel 4WD Presisi Tinggi', 'order_index' => 4, 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('catalog_media')->insert([
            ['catalog_item_id' => $item2Id, 'file_url' => '/images/sequence/robot-frame-01.jpg', 'media_type' => 'image', 'is_primary' => true, 'caption' => 'Frame 01: Tampak Depan', 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item2Id, 'file_url' => '/images/sequence/robot-frame-02.jpg', 'media_type' => 'image', 'is_primary' => false, 'caption' => 'Frame 02: Sudut Tiga Perempat', 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item2Id, 'file_url' => '/images/sequence/robot-frame-03.jpg', 'media_type' => 'image', 'is_primary' => false, 'caption' => 'Frame 03: Profil Samping Penuh', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 7. Item 3: Jasa Vokasi Software House
        $item3Id = DB::table('catalog_items')->insertGetId([
            'prodi_id' => $tifId,
            'category_id' => $catJasa,
            'nama_item' => 'Vokasi Software House - Jasa Pengembangan Sistem Web & Mobile',
            'slug' => 'vokasi-software-house-web-mobile',
            'tagline' => 'Solusi Digitalisasi Industri, Sistem Informasi Manajemen, & Custom ERP',
            'deskripsi_singkat' => 'Layanan pembuatan software teruji industri yang dibina oleh dosen pakar dan mahasiswa berprestasi.',
            'deskripsi_lengkap' => 'Paket layanan mencakup tahapan Product Requirement Document (PRD), perancangan UI/UX Figma, pengembangan kode standar CI/CD, pengujian penetrasi (Pentest), dan pemeliharaan server.',
            'live_demo_url' => null,
            'model_3d_url' => null,
            'thumbnail_url' => '/images/catalog/software-house-showcase.jpg',
            'status_publikasi' => 'published',
            'harga_tipe' => 'starting_at',
            'harga_nominal' => 15000000.00,
            'pic_nama' => 'Unit Bisnis Mahasiswa TIF UNS',
            'pic_kontak' => '6281234567893',
            'pic_laboratorium' => 'Studio Digital Terapan Vokasi',
            'view_count' => 950,
            'demo_click_count' => 0,
            'inquiry_count' => 19,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('catalog_specs')->insert([
            ['catalog_item_id' => $item3Id, 'group_name' => 'Layanan', 'spec_key' => 'Deliverables', 'spec_value' => 'Source Code Git, Lisensi Penuh, Dokumentasi API', 'order_index' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item3Id, 'group_name' => 'Layanan', 'spec_key' => 'Estimasi Pengerjaan', 'spec_value' => '30 - 60 Hari Kerja per Sprint', 'order_index' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item3Id, 'group_name' => 'Garansi', 'spec_key' => 'Masa Pemeliharaan', 'spec_value' => 'Free Bug Fixing 3 Bulan Pasca Rilis', 'order_index' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['catalog_item_id' => $item3Id, 'group_name' => 'Alur Kerja', 'spec_key' => 'Metodologi', 'spec_value' => 'Agile Scrum, PRD, Desain UI/UX Figma, Pentest', 'order_index' => 4, 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('catalog_media')->insert([
            ['catalog_item_id' => $item3Id, 'file_url' => '/images/catalog/software-house-showcase.jpg', 'media_type' => 'image', 'is_primary' => true, 'caption' => 'Portofolio Layanan Vokasi Software House', 'created_at' => now(), 'updated_at' => now()],
        ]);

        // 8. Inquiries Seeder (Sample inquiry dari Mitra DUDI)
        DB::table('inquiries')->insert([
            [
                'catalog_item_id' => $item1Id,
                'nama_pengunjung' => 'Budi Santoso',
                'instansi' => 'PT Solusi Teknologi Nusantara',
                'email' => 'budi@solusitek.co.id',
                'no_wa' => '6281122334455',
                'pesan' => 'Tertarik untuk mengadopsi platform SaaS Rintisku untuk program inkubasi startup internal perusahaan kami.',
                'status' => 'responded',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(1),
            ],
            [
                'catalog_item_id' => $item2Id,
                'nama_pengunjung' => 'Hendro Wijaya',
                'instansi' => 'PT Manufaktur Presisi Cikarang',
                'email' => 'hendro@presisi.com',
                'no_wa' => '6281199887766',
                'pesan' => 'Mohon penawaran harga pengadaan 2 unit Robot Patroli Otonom untuk keamanan pergudangan.',
                'status' => 'deal',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(2),
            ],
            [
                'catalog_item_id' => $item3Id,
                'nama_pengunjung' => 'Siti Rahmawati',
                'instansi' => 'Dinas Koperasi & UMKM Madiun',
                'email' => 'siti@madiunkab.go.id',
                'no_wa' => '6281344556677',
                'pesan' => 'Kami membutuhkan sistem informasi pendataan UMKM terintegrasi mobile dan web.',
                'status' => 'unread',
                'created_at' => now()->subHours(12),
                'updated_at' => now()->subHours(12),
            ],
        ]);
    }
}
