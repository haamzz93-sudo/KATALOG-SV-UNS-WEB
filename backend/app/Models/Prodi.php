<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Prodi extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode_prodi',
        'nama_prodi',
        'jenjang',
        'fakultas_sekolah',
        'kontak_email',
        'kontak_wa',
        'logo_url',
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function catalogItems(): HasMany
    {
        return $this->hasMany(CatalogItem::class);
    }
}
