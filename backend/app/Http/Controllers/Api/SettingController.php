<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SettingController extends Controller
{
    /**
     * Get all public site settings
     */
    public function index(): JsonResponse
    {
        $settings = SiteSetting::all()->pluck('value', 'key')->map(function ($val) {
            $decoded = json_decode($val, true);
            return (json_last_error() === JSON_ERROR_NONE) ? $decoded : $val;
        });

        $result = $settings->toArray();
        if (isset($result['settings']) && is_array($result['settings'])) {
            $result = array_merge($result['settings'], $result);
            unset($result['settings']);
        }

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    /**
     * Save or update settings in batch
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->all();
        if (isset($data['settings']) && is_array($data['settings'])) {
            $data = array_merge($data, $data['settings']);
            unset($data['settings']);
        }

        foreach ($data as $key => $value) {
            $group = 'general';
            if (str_starts_with($key, 'footer_')) {
                $group = 'footer';
            } elseif (str_starts_with($key, 'login_')) {
                $group = 'login';
            } elseif (str_starts_with($key, 'brand_') || str_starts_with($key, 'logo_')) {
                $group = 'brand';
            } elseif (str_starts_with($key, 'showcase_')) {
                $group = 'showcase';
            }

            SiteSetting::set($key, $value, $group);
        }

        // Auto-sync nama kategori resmi di tabel MySQL jika tab di-rename
        if (!empty($data['catalog_tab_teknologi_id'])) {
            \App\Models\Category::where('slug', 'teknologi')->update(['nama' => $data['catalog_tab_teknologi_id']]);
        }
        if (!empty($data['catalog_tab_produk_id'])) {
            \App\Models\Category::where('slug', 'produk')->update(['nama' => $data['catalog_tab_produk_id']]);
        }
        if (!empty($data['catalog_tab_jasa_id'])) {
            \App\Models\Category::where('slug', 'jasa')->update(['nama' => $data['catalog_tab_jasa_id']]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pengaturan landing page & sistem berhasil disimpan ke database.',
        ]);
    }

    /**
     * Upload image or video with strict validation
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:51200', // Max 50MB
        ]);

        $file = $request->file('file');
        $mime = $file->getMimeType();
        $isImage = str_starts_with($mime, 'image/');
        $isVideo = str_starts_with($mime, 'video/');

        if (!$isImage && !$isVideo) {
            return response()->json([
                'success' => false,
                'message' => 'Format file tidak didukung. Harap upload gambar (JPG, PNG, WEBP, SVG) atau video (MP4, WEBM).',
            ], 422);
        }

        // Limit images to max 10MB
        if ($isImage && $file->getSize() > 10 * 1024 * 1024) {
            return response()->json([
                'success' => false,
                'message' => 'Ukuran foto melebihi batas maksimal 10MB.',
            ], 422);
        }

        // Limit videos to max 50MB
        if ($isVideo && $file->getSize() > 50 * 1024 * 1024) {
            return response()->json([
                'success' => false,
                'message' => 'Ukuran video melebihi batas maksimal 50MB.',
            ], 422);
        }

        $extension = $file->getClientOriginalExtension() ?: ($isImage ? 'png' : 'mp4');
        $fileName = ($isImage ? 'img_' : 'vid_') . time() . '_' . Str::random(8) . '.' . $extension;

        $targetDir = public_path('uploads');
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $file->move($targetDir, $fileName);
        $fileUrl = '/uploads/' . $fileName;

        // Auto-sync ke frontend/public/uploads jika tersedia (baik lokal maupun struktur VPS)
        $frontendPublic = base_path('../frontend/public/uploads');
        if (file_exists(base_path('../frontend/public'))) {
            if (!file_exists($frontendPublic)) {
                @mkdir($frontendPublic, 0755, true);
            }
            @copy($targetDir . DIRECTORY_SEPARATOR . $fileName, $frontendPublic . DIRECTORY_SEPARATOR . $fileName);
        }

        return response()->json([
            'success' => true,
            'message' => ($isImage ? 'Foto' : 'Video') . ' berhasil diunggah.',
            'url' => $fileUrl,
            'type' => $isImage ? 'image' : 'video',
            'file_name' => $fileName,
            'size_bytes' => $file->getSize(),
        ]);
    }
}
