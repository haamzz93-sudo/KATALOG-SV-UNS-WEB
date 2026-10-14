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
        if (Schema::hasTable('catalog_items')) {
            try {
                DB::statement('ALTER TABLE catalog_items MODIFY thumbnail_url LONGTEXT NOT NULL');
            } catch (\Throwable $e) {}

            try {
                DB::statement('ALTER TABLE catalog_items MODIFY live_demo_url LONGTEXT NULL');
            } catch (\Throwable $e) {}

            try {
                DB::statement('ALTER TABLE catalog_items MODIFY model_3d_url LONGTEXT NULL');
            } catch (\Throwable $e) {}
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('catalog_items')) {
            try {
                DB::statement('ALTER TABLE catalog_items MODIFY thumbnail_url VARCHAR(500) NOT NULL');
            } catch (\Throwable $e) {}

            try {
                DB::statement('ALTER TABLE catalog_items MODIFY live_demo_url VARCHAR(500) NULL');
            } catch (\Throwable $e) {}

            try {
                DB::statement('ALTER TABLE catalog_items MODIFY model_3d_url VARCHAR(500) NULL');
            } catch (\Throwable $e) {}
        }
    }
};
