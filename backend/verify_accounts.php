<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\CatalogItem;
use App\Models\Prodi;
use Illuminate\Support\Facades\Hash;

echo "=== VERIFIKASI AKUN ADMIN PRODI ===\n";
$users = User::with(['role', 'prodi'])->where('role_id', 3)->orderBy('id')->get();
echo "Total Admin Prodi Terdaftar: " . $users->count() . "\n\n";

$headers = sprintf("%-4s | %-32s | %-35s | %-20s | %-6s\n", "ID", "Nama Pengguna", "Email Login", "Prodi", "Produk");
echo $headers;
echo str_repeat("-", 105) . "\n";

foreach ($users as $u) {
    $prodiName = $u->prodi ? $u->prodi->nama_prodi : '-';
    $productCount = $u->prodi_id ? CatalogItem::where('prodi_id', $u->prodi_id)->count() : 0;
    $passCheck = Hash::check('ProdiSV2026!', $u->password) ? 'OK' : 'ERR';
    printf("%-4d | %-32s | %-35s | %-20s | %-6d\n", $u->id, substr($u->name, 0, 32), $u->email, substr($prodiName, 0, 20), $productCount);
}

echo "\n=== CONTOH PRODUK TERDAFTAR PER PRODI ===\n";
$items = CatalogItem::with('prodi')->take(10)->get();
foreach ($items as $it) {
    echo "- " . $it->nama_item . " (" . ($it->prodi ? $it->prodi->nama_prodi : '-') . ") -> Thumbs: " . $it->thumbnail_url . "\n";
}
