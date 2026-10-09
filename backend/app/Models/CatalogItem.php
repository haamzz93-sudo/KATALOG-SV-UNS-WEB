<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CatalogItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'prodi_id',
        'category_id',
        'nama_item',
        'slug',
        'tagline',
        'deskripsi_singkat',
        'deskripsi_lengkap',
        'live_demo_url',
        'model_3d_url',
        'thumbnail_url',
        'status_publikasi',
        'harga_tipe',
        'harga_nominal',
        'pic_nama',
        'pic_kontak',
        'pic_laboratorium',
        'view_count',
        'demo_click_count',
        'inquiry_count',
    ];

    protected $casts = [
        'harga_nominal' => 'float',
        'view_count' => 'integer',
        'demo_click_count' => 'integer',
        'inquiry_count' => 'integer',
    ];

    public function prodi(): BelongsTo
    {
        return $this->belongsTo(Prodi::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function specs(): HasMany
    {
        return $this->hasMany(CatalogSpec::class)->orderBy('order_index');
    }

    public function media(): HasMany
    {
        return $this->hasMany(CatalogMedia::class);
    }

    public function inquiries(): HasMany
    {
        return $this->hasMany(Inquiry::class);
    }
}
