<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Artisan::command('catalog:clear-items', function () {
    $count = DB::table('catalog_items')->count();
    DB::table('catalog_specs')->delete();
    DB::table('catalog_media')->delete();
    DB::table('inquiries')->delete();
    DB::table('catalog_items')->delete();
    $this->info("Berhasil menghapus {$count} produk inovasi katalog lawas beserta relasi spesifikasi dan medianya.");
})->purpose('Menghapus seluruh produk inovasi katalog lama agar bersih dan siap dengan format studio foto & spesifikasi terbaru');

Artisan::command('catalog:seed-official', function () {
    $this->info("Menjalankan seeder produk inovasi resmi SV UNS...");
    Artisan::call('db:seed', ['--class' => 'OfficialCatalogPdfSeeder', '--force' => true]);
    $this->info(Artisan::output());
    $count = DB::table('catalog_items')->count();
    $mediaCount = DB::table('catalog_media')->count();
    $specsCount = DB::table('catalog_specs')->count();
    $this->info("Sukses! Total {$count} produk inovasi resmi, {$mediaCount} foto galeri, dan {$specsCount} spesifikasi teknis aktif.");
})->purpose('Mengisi seluruh inovasi, produk, dan jasa resmi SV UNS beserta foto galeri dan spesifikasi teknis');

Artisan::command('catalog:list', function () {
    $items = DB::table('catalog_items')
        ->join('categories', 'catalog_items.category_id', '=', 'categories.id')
        ->join('prodis', 'catalog_items.prodi_id', '=', 'prodis.id')
        ->select('catalog_items.id', 'catalog_items.nama_item', 'categories.nama as kategori', 'prodis.nama_prodi', 'catalog_items.harga_tipe', 'catalog_items.harga_nominal')
        ->get();
    
    $headers = ['ID', 'Nama Inovasi / Produk', 'Kategori', 'Prodi Pengembang', 'Skema Harga', 'Nominal'];
    $rows = $items->map(function ($i) {
        $nominal = $i->harga_nominal ? 'Rp ' . number_format($i->harga_nominal, 0, ',', '.') : '-';
        return [$i->id, $i->nama_item, $i->kategori, $i->nama_prodi, $i->harga_tipe, $nominal];
    });
    $this->table($headers, $rows);
})->purpose('Menampilkan seluruh produk katalog yang tersimpan');

