<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatalogMedia extends Model
{
    use HasFactory;

    protected $table = 'catalog_media';

    protected $fillable = [
        'catalog_item_id',
        'file_url',
        'media_type',
        'is_primary',
        'caption',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
    ];

    public function catalogItem(): BelongsTo
    {
        return $this->belongsTo(CatalogItem::class);
    }
}
