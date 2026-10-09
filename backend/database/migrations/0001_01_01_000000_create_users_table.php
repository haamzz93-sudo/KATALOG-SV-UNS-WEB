<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->unique(); // super_admin, pimpinan_sv, prodi
            $table->string('label', 100);
            $table->timestamps();
        });

        Schema::create('prodis', function (Blueprint $table) {
            $table->id();
            $table->string('kode_prodi', 20)->unique(); // cth: D3-TIF, D4-RPL, D3-TM
            $table->string('nama_prodi', 150);
            $table->string('jenjang', 50)->default('D3'); // D3, D4, Sarjana Terapan
            $table->string('fakultas_sekolah', 100)->default('Sekolah Vokasi');
            $table->string('kontak_email', 100)->nullable();
            $table->string('kontak_wa', 30)->nullable();
            $table->string('logo_url')->nullable();
            $table->timestamps();
        });

        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->foreignId('prodi_id')->nullable()->constrained('prodis')->nullOnDelete();
            $table->string('name', 150);
            $table->string('email', 150)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->boolean('is_active')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
        Schema::dropIfExists('prodis');
        Schema::dropIfExists('roles');
    }
};
