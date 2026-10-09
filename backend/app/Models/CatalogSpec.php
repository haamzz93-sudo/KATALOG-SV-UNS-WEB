<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CatalogSpec extends Model
{
    use HasFactory;

    protected $fillable = [
        'catalog_item_id',
        'group_name',
        'spec_key',
        'spec_value',
        'order_index',
    ];

    public function catalogItem(): BelongsTo
    {
        return $this->belongsTo(CatalogItem::class);
    }
}
