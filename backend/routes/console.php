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

