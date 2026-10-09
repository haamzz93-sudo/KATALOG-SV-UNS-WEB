<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'nama',
        'deskripsi',
        'icon_name',
    ];

    public function catalogItems(): HasMany
    {
        return $this->hasMany(CatalogItem::class);
    }
}
