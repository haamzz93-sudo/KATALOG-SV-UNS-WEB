<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AiCatalogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PimpinanController;
use App\Http\Controllers\Api\ProdiCatalogController;
use App\Http\Controllers\Api\PublicCatalogController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

$registerRoutes = function () {
    // 1. Public Endpoints (Tanpa Token)
    Route::prefix('public')->group(function () {
        Route::get('/categories', [PublicCatalogController::class, 'getCategories']);
        Route::get('/prodis', [PublicCatalogController::class, 'getProdis']);
        Route::get('/catalog', [PublicCatalogController::class, 'index']);
        Route::get('/catalog/{slug}', [PublicCatalogController::class, 'show']);
        Route::post('/catalog/{id}/demo-click', [PublicCatalogController::class, 'demoClick']);
        Route::post('/inquiries', [PublicCatalogController::class, 'submitInquiry']);
        Route::get('/settings', [SettingController::class, 'index']);
        Route::post('/upload', [SettingController::class, 'upload']);
        Route::get('/file/{filename}', [SettingController::class, 'serveFile']);
        Route::get('/stats', [PimpinanController::class, 'dashboardStats']);
        Route::post('/ai/catalog-photo', [AiCatalogController::class, 'generatePhotos']);
        Route::post('/ai/test-key', [AiCatalogController::class, 'testKey']);
        Route::post('/ai/test-openai-key', [AiCatalogController::class, 'testOpenAiKey']);
        Route::get('/ai/image-proxy', [AiCatalogController::class, 'proxyImage']);
    });

    // 2. Auth Endpoints
    Route::prefix('auth')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });

    // 3. Protected Endpoints (Bearer Token Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        // Admin Prodi
        Route::prefix('prodi')->group(function () {
            Route::get('/my-items', [ProdiCatalogController::class, 'myItems']);
            Route::get('/items/{id}', [ProdiCatalogController::class, 'show']);
            Route::post('/items', [ProdiCatalogController::class, 'store']);
            Route::put('/items/{id}', [ProdiCatalogController::class, 'update']);
            Route::delete('/items/{id}', [ProdiCatalogController::class, 'destroy']);
            Route::delete('/clear-all', [ProdiCatalogController::class, 'clearAll']);
            Route::post('/clear-all', [ProdiCatalogController::class, 'clearAll']);
        });

        // Pimpinan SV (Executive View-Only Analytics & Reports)
        Route::prefix('pimpinan')->group(function () {
            Route::get('/dashboard-stats', [PimpinanController::class, 'dashboardStats']);
            Route::get('/export-report', [PimpinanController::class, 'exportReport']);
        });

        // Super Admin
        Route::prefix('admin')->group(function () {
            Route::get('/users', [AdminController::class, 'users']);
            Route::post('/users', [AdminController::class, 'storeUser']);
            Route::put('/users/{id}', [AdminController::class, 'updateUser']);
            Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
            Route::patch('/users/{id}/toggle-status', [AdminController::class, 'toggleUserStatus']);
            Route::patch('/items/{id}/status', [AdminController::class, 'updateItemStatus']);
            Route::post('/settings', [SettingController::class, 'update']);
            Route::get('/prodis', [AdminController::class, 'prodis']);
            Route::post('/prodis', [AdminController::class, 'storeProdi']);
            Route::put('/prodis/{id}', [AdminController::class, 'updateProdi']);
            Route::delete('/prodis/{id}', [AdminController::class, 'deleteProdi']);
            Route::delete('/clear-catalog-items', [ProdiCatalogController::class, 'clearAll']);
            Route::post('/clear-catalog-items', [ProdiCatalogController::class, 'clearAll']);
        });
    });

    // Public fallback for settings & prodi update & direct AI endpoints
    Route::post('/settings', [SettingController::class, 'update']);
    Route::post('/admin/prodis', [AdminController::class, 'storeProdi']);
    Route::put('/admin/prodis/{id}', [AdminController::class, 'updateProdi']);
    Route::delete('/admin/prodis/{id}', [AdminController::class, 'deleteProdi']);
    Route::post('/admin/clear-catalog-items', [ProdiCatalogController::class, 'clearAll']);
    Route::delete('/admin/clear-catalog-items', [ProdiCatalogController::class, 'clearAll']);
    Route::post('/ai/catalog-photo', [AiCatalogController::class, 'generatePhotos']);
    Route::post('/ai/test-key', [AiCatalogController::class, 'testKey']);
    Route::get('/ai/image-proxy', [AiCatalogController::class, 'proxyImage']);
    Route::get('/image-proxy', [AiCatalogController::class, 'proxyImage']);
};

Route::prefix('v1')->group($registerRoutes);
$registerRoutes();

