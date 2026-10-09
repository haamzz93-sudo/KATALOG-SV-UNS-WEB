<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OfficialCatalogPdfSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Pastikan Role 'prodi' (ID 3) tersedia
        $prodiRole = DB::table('roles')->where('name', 'prodi')->first();
        if (!$prodiRole) {
            $prodiRoleId = DB::table('roles')->insertGetId([
                'name' => 'prodi',
                'label' => 'Administrator Program Studi',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $prodiRoleId = $prodiRole->id;
        }

        // 1B. Update Nama Kategori Resmi agar Universal & Relevan untuk Seluruh 45 Prodi
        DB::table('categories')->where('slug', 'teknologi')->update([
            'nama' => 'Teknologi & Digital',
            'deskripsi' => 'Aplikasi web, sistem cerdas, platform SaaS, dan transformasi digital kampus.',
        ]);
        DB::table('categories')->where('slug', 'produk')->update([
            'nama' => 'Produk Inovasi & Riset',
            'deskripsi' => 'Produk pangan, formulasi herbal, mesin perkakas, dan inovasi riset terapan.',
        ]);
        DB::table('categories')->where('slug', 'jasa')->update([
            'nama' => 'Jasa & Layanan Keahlian',
            'deskripsi' => 'Pengujian lab terakreditasi, sertifikasi kompetensi, konsultasi bisnis/pajak, dan alih teknologi.',
        ]);

        // 2. Daftar Lengkap Program Studi Sekolah Vokasi UNS (Pusat & Madiun + PDF Resmi)
        $prodisList = [
            // Magister
            ['kode' => 'S2-K3', 'nama' => 'S2 Terapan Keselamatan dan Kesehatan Kerja (K3)', 'jenjang' => 'S2 Terapan'],
            
            // Sarjana Terapan (D4)
            ['kode' => 'D4-BK', 'nama' => 'Sarjana Terapan Bisnis Kreatif', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-K3', 'nama' => 'Sarjana Terapan Keselamatan dan Kesehatan Kerja', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-ML', 'nama' => 'Sarjana Terapan Manajemen Logistik', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-MICE', 'nama' => 'Sarjana Terapan Pengelolaan Konvensi dan Acara (MICE)', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-KEB', 'nama' => 'Sarjana Terapan Kebidanan', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-UPW', 'nama' => 'Sarjana Terapan Usaha Perjalanan Wisata', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-PT', 'nama' => 'Sarjana Terapan Produksi Ternak', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-RPL', 'nama' => 'Sarjana Terapan Rekayasa Perangkat Lunak', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-SD', 'nama' => 'Sarjana Terapan Sains Data', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-SDA', 'nama' => 'Sarjana Terapan Sumber Daya Air', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-TB', 'nama' => 'Sarjana Terapan Tata Boga', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-TK', 'nama' => 'Sarjana Terapan Teknologi Komputer', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-TP', 'nama' => 'Sarjana Terapan Teknologi Pangan', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-TRKL', 'nama' => 'Sarjana Terapan Teknologi Rekayasa Kendaraan Listrik', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-TRO', 'nama' => 'Sarjana Terapan Teknologi Rekayasa Otomasi', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-TIKA', 'nama' => 'Sarjana Terapan Teknologi Informasi dan Kecerdasan Artifisial', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-TRP', 'nama' => 'Sarjana Terapan Teknologi Rekayasa Pangan', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-TRM', 'nama' => 'Sarjana Terapan Teknologi Rekayasa Manufaktur', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-DMD', 'nama' => 'Sarjana Terapan Desain Media Digital', 'jenjang' => 'Sarjana Terapan'],
            ['kode' => 'D4-MK', 'nama' => 'Sarjana Terapan Manajemen Konstruksi', 'jenjang' => 'Sarjana Terapan'],

            // Diploma Tiga (D3)
            ['kode' => 'D3-AKT', 'nama' => 'D3 Akuntansi', 'jenjang' => 'D3'],
            ['kode' => 'D3-AKT-MDN', 'nama' => 'D3 Akuntansi (Kampus Madiun)', 'jenjang' => 'D3'],
            ['kode' => 'D3-TIF', 'nama' => 'D3 Teknik Informatika', 'jenjang' => 'D3'],
            ['kode' => 'D3-TIF-MDN', 'nama' => 'D3 Teknik Informatika (Kampus Madiun)', 'jenjang' => 'D3'],
            ['kode' => 'D3-BING', 'nama' => 'D3 Bahasa Inggris', 'jenjang' => 'D3'],
            ['kode' => 'D3-BMAND', 'nama' => 'D3 Bahasa Mandarin', 'jenjang' => 'D3'],
            ['kode' => 'D3-BDT', 'nama' => 'D3 Budidaya Ternak', 'jenjang' => 'D3'],
            ['kode' => 'D3-DKV', 'nama' => 'D3 Desain Komunikasi Visual', 'jenjang' => 'D3'],
            ['kode' => 'D3-FAR', 'nama' => 'D3 Farmasi', 'jenjang' => 'D3'],
            ['kode' => 'D3-KEB', 'nama' => 'D3 Kebidanan', 'jenjang' => 'D3'],
            ['kode' => 'D3-KP', 'nama' => 'D3 Keuangan Perbankan', 'jenjang' => 'D3'],
            ['kode' => 'D3-MB', 'nama' => 'D3 Manajemen Bisnis', 'jenjang' => 'D3'],
            ['kode' => 'D3-MPEM', 'nama' => 'D3 Manajemen Pemasaran', 'jenjang' => 'D3'],
            ['kode' => 'D3-MPER', 'nama' => 'D3 Manajemen Perdagangan', 'jenjang' => 'D3'],
            ['kode' => 'D3-MA', 'nama' => 'D3 Manajemen Administrasi', 'jenjang' => 'D3'],
            ['kode' => 'D3-PJK', 'nama' => 'D3 Perpajakan', 'jenjang' => 'D3'],
            ['kode' => 'D3-TM', 'nama' => 'D3 Teknik Mesin', 'jenjang' => 'D3'],
            ['kode' => 'D3-TS', 'nama' => 'D3 Teknik Sipil', 'jenjang' => 'D3'],
            ['kode' => 'D3-THP', 'nama' => 'D3 Teknologi Hasil Pertanian', 'jenjang' => 'D3'],
            ['kode' => 'D3-KT', 'nama' => 'D3 Komunikasi Terapan', 'jenjang' => 'D3'],
            ['kode' => 'D3-UPW', 'nama' => 'D3 Usaha Perjalanan Wisata', 'jenjang' => 'D3'],
            ['kode' => 'D3-TKIM', 'nama' => 'D3 Teknik Kimia', 'jenjang' => 'D3'],
            ['kode' => 'D3-PUS', 'nama' => 'D3 Perpustakaan', 'jenjang' => 'D3'],
            ['kode' => 'D3-AGR', 'nama' => 'D3 Agribisnis', 'jenjang' => 'D3'],
        ];

        // 3. Upsert Program Studi
        $prodiMap = [];
        foreach ($prodisList as $p) {
            $slugClean = strtolower(str_replace(['-', ' '], ['', ''], $p['kode']));
            $existing = DB::table('prodis')->where('kode_prodi', $p['kode'])->first();
            
            if ($existing) {
                DB::table('prodis')->where('id', $existing->id)->update([
                    'nama_prodi' => $p['nama'],
                    'jenjang' => $p['jenjang'],
                    'updated_at' => now(),
                ]);
                $prodiMap[$p['kode']] = $existing->id;
            } else {
                $newId = DB::table('prodis')->insertGetId([
                    'kode_prodi' => $p['kode'],
                    'nama_prodi' => $p['nama'],
                    'jenjang' => $p['jenjang'],
                    'fakultas_sekolah' => 'Sekolah Vokasi UNS',
                    'kontak_email' => "{$slugClean}@vokasi.uns.ac.id",
                    'kontak_wa' => '6281234567890',
                    'logo_url' => '/images/brand/logo-sv-uns-official-color.png',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $prodiMap[$p['kode']] = $newId;
            }
        }

        // 4. Buat / Perbarui Akun Pengguna Admin Prodi (Password Standar: ProdiSV2026!)
        $defaultPasswordHash = Hash::make('ProdiSV2026!');
        
        // Ambil semua prodi dari DB
        $allProdis = DB::table('prodis')->get();
        foreach ($allProdis as $pr) {
            $slugClean = strtolower(str_replace(['-', ' '], ['', ''], $pr->kode_prodi));
            $prodiEmail = "admin.{$slugClean}@vokasi.uns.ac.id";
            
            // Khusus TIF jika sudah ada email admin.tif@vokasi.uns.ac.id
            if ($pr->kode_prodi === 'D3-TIF') {
                $prodiEmail = 'admin.tif@vokasi.uns.ac.id';
            } elseif ($pr->kode_prodi === 'D3-AKT') {
                $prodiEmail = 'admin.akuntansi@vokasi.uns.ac.id';
            }

            $userExists = DB::table('users')->where('email', $prodiEmail)->first();
            if ($userExists) {
                DB::table('users')->where('id', $userExists->id)->update([
                    'name' => 'Admin ' . $pr->nama_prodi,
                    'role_id' => $prodiRoleId,
                    'prodi_id' => $pr->id,
                    'password' => $defaultPasswordHash,
                    'is_active' => true,
                    'updated_at' => now(),
                ]);
            } else {
                // Check if user with this prodi_id already exists with another email
                $existingByProdi = DB::table('users')->where('prodi_id', $pr->id)->first();
                if ($existingByProdi) {
                    DB::table('users')->where('id', $existingByProdi->id)->update([
                        'role_id' => $prodiRoleId,
                        'password' => $defaultPasswordHash,
                        'is_active' => true,
                        'updated_at' => now(),
                    ]);
                } else {
                    DB::table('users')->insert([
                        'name' => 'Admin ' . $pr->nama_prodi,
                        'email' => $prodiEmail,
                        'password' => $defaultPasswordHash,
                        'role_id' => $prodiRoleId,
                        'prodi_id' => $pr->id,
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }

        // 5. Muat dan Masukkan Data Katalog Produk dari JSON Hasil Ekstraksi PDF
        $jsonPath = base_path('../products_to_seed.json');
        if (!file_exists($jsonPath)) {
            $jsonPath = base_path('products_to_seed.json');
        }

        if (file_exists($jsonPath)) {
            $products = json_decode(file_get_contents($jsonPath), true);
            foreach ($products as $prod) {
                $prodiId = $prodiMap[$prod['prodi_code']] ?? $prodiMap['D3-TIF'] ?? 1;

                $catalogItem = DB::table('catalog_items')->where('slug', $prod['slug'])->first();
                
                $itemData = [
                    'prodi_id' => $prodiId,
                    'category_id' => $prod['category_id'],
                    'nama_item' => $prod['nama_item'],
                    'slug' => $prod['slug'],
                    'tagline' => $prod['tagline'],
                    'deskripsi_singkat' => $prod['deskripsi_singkat'],
                    'deskripsi_lengkap' => $prod['deskripsi_lengkap'],
                    'live_demo_url' => $prod['live_demo_url'] ?? null,
                    'model_3d_url' => null,
                    'thumbnail_url' => $prod['thumbnail_url'],
                    'status_publikasi' => 'published',
                    'harga_tipe' => $prod['harga_tipe'] ?? 'contact_us',
                    'harga_nominal' => $prod['harga_nominal'] ?? 0.00,
                    'pic_nama' => $prod['pic_nama'] ?? 'Laboratorium Vokasi UNS',
                    'pic_kontak' => $prod['pic_kontak'] ?? '6281234567890',
                    'pic_laboratorium' => $prod['pic_laboratorium'] ?? 'Teaching Factory SV UNS',
                    'updated_at' => now(),
                ];

                if ($catalogItem) {
                    DB::table('catalog_items')->where('id', $catalogItem->id)->update($itemData);
                    $itemId = $catalogItem->id;
                } else {
                    $itemData['view_count'] = rand(150, 850);
                    $itemData['demo_click_count'] = rand(10, 120);
                    $itemData['inquiry_count'] = rand(3, 25);
                    $itemData['created_at'] = now();
                    $itemId = DB::table('catalog_items')->insertGetId($itemData);
                }

                // Specs
                DB::table('catalog_specs')->where('catalog_item_id', $itemId)->delete();
                if (!empty($prod['specs'])) {
                    foreach ($prod['specs'] as $index => $spec) {
                        DB::table('catalog_specs')->insert([
                            'catalog_item_id' => $itemId,
                            'group_name' => $spec['group_name'] ?? 'General',
                            'spec_key' => $spec['spec_key'],
                            'spec_value' => $spec['spec_value'],
                            'order_index' => $index + 1,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }

                // Media Gallery
                DB::table('catalog_media')->where('catalog_item_id', $itemId)->delete();
                if (!empty($prod['gallery'])) {
                    foreach ($prod['gallery'] as $idx => $mediaUrl) {
                        DB::table('catalog_media')->insert([
                            'catalog_item_id' => $itemId,
                            'file_url' => $mediaUrl,
                            'media_type' => 'image',
                            'is_primary' => ($idx === 0),
                            'caption' => $prod['nama_item'] . ' - Tampilan ' . ($idx + 1),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
            }
        }
    }
}
