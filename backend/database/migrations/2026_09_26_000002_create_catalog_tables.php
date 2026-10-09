<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 50)->unique(); // teknologi, produk, jasa
            $table->string('nama', 100);
            $table->text('deskripsi')->nullable();
            $table->string('icon_name', 50)->default('Box');
            $table->timestamps();
        });

        Schema::create('catalog_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prodi_id')->constrained('prodis')->cascadeOnDelete();
            $table->foreignId('category_id')->constrained('categories')->cascadeOnDelete();
            $table->string('nama_item', 200);
            $table->string('slug', 220)->unique();
            $table->string('tagline', 255)->nullable();
            $table->text('deskripsi_singkat');
            $table->longText('deskripsi_lengkap');
            
            // Kolom Khusus Layanan
            $table->string('live_demo_url', 500)->nullable(); // Khusus Teknologi/SaaS
            $table->string('model_3d_url', 500)->nullable();   // Khusus Robot/IoT (Spline/GLB)
            
            // Visual & Status
            $table->string('thumbnail_url', 500);
            $table->enum('status_publikasi', ['draft', 'published', 'archived'])->default('published');
            
            // Harga & Transaksi
            $table->enum('harga_tipe', ['fixed', 'starting_at', 'contact_us'])->default('starting_at');
            $table->decimal('harga_nominal', 15, 2)->default(0.00);
            
            // Kontak PIC / Laboratorium
            $table->string('pic_nama', 150);
            $table->string('pic_kontak', 50); // No WA
            $table->string('pic_laboratorium', 150)->nullable();

            // Metrik untuk Dashboard Pimpinan SV
            $table->unsignedBigInteger('view_count')->default(0);
            $table->unsignedBigInteger('demo_click_count')->default(0);
            $table->unsignedBigInteger('inquiry_count')->default(0);

            $table->timestamps();
            
            $table->index(['category_id', 'status_publikasi']);
            $table->index(['prodi_id', 'status_publikasi']);
        });

        Schema::create('catalog_specs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_item_id')->constrained('catalog_items')->cascadeOnDelete();
            $table->string('group_name', 100)->default('General'); // cth: 'Tech Stack', 'Hardware', 'SLA'
            $table->string('spec_key', 100);   // cth: 'Framework', 'DOF', 'Waktu Pengerjaan'
            $table->text('spec_value');        // cth: 'Next.js 14 + Laravel', '12 Derajat', '14 Hari'
            $table->integer('order_index')->default(0);
            $table->timestamps();
        });

        Schema::create('catalog_media', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_item_id')->constrained('catalog_items')->cascadeOnDelete();
            $table->string('file_url', 500);
            $table->enum('media_type', ['image', 'video', 'glb'])->default('image');
            $table->boolean('is_primary')->default(false);
            $table->string('caption', 200)->nullable();
            $table->timestamps();
        });

        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('catalog_item_id')->constrained('catalog_items')->cascadeOnDelete();
            $table->string('nama_pengunjung', 150);
            $table->string('instansi', 150); // Industri/Perusahaan mitra
            $table->string('email', 150);
            $table->string('no_wa', 50);
            $table->text('pesan');
            $table->enum('status', ['unread', 'responded', 'deal'])->default('unread');
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('inquiries');
        Schema::dropIfExists('catalog_media');
        Schema::dropIfExists('catalog_specs');
        Schema::dropIfExists('catalog_items');
        Schema::dropIfExists('categories');
    }
};
