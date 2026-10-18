<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('catalog_media')) {
            try {
                DB::statement('ALTER TABLE catalog_media MODIFY file_url LONGTEXT NOT NULL');
            } catch (\Throwable $e) {}

            try {
                DB::statement('ALTER TABLE catalog_media MODIFY caption TEXT NULL');
            } catch (\Throwable $e) {}
        }

        if (Schema::hasTable('catalog_items')) {
            try {
                DB::statement('ALTER TABLE catalog_items MODIFY harga_nominal DECIMAL(15,2) DEFAULT 0 NULL');
            } catch (\Throwable $e) {}
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('catalog_media')) {
            try {
                DB::statement('ALTER TABLE catalog_media MODIFY file_url VARCHAR(500) NOT NULL');
            } catch (\Throwable $e) {}
        }
    }
};
