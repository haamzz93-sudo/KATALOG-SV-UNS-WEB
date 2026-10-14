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

        try {
            $extension = $file->getClientOriginalExtension() ?: ($isImage ? 'png' : 'mp4');
            $fileName = ($isImage ? 'img_' : 'vid_') . time() . '_' . Str::random(8) . '.' . $extension;

            $targetDir = public_path('uploads');
            if (!is_dir($targetDir)) {
                @mkdir($targetDir, 0777, true);
            }
            @chmod($targetDir, 0777);

            $saved = false;
            $fileUrl = '/uploads/' . $fileName;

            // Strategy 1: Direct move to public/uploads
            if (is_dir($targetDir) && is_writable($targetDir)) {
                try {
                    $file->move($targetDir, $fileName);
                    $saved = true;
                } catch (\Throwable $moveEx) {
                    \Illuminate\Support\Facades\Log::warning("Direct upload move failed: " . $moveEx->getMessage());
                }
            }

            // Strategy 2: If direct move failed or folder not writable, use Laravel Storage disk ('public')
            if (!$saved) {
                try {
                    $path = \Illuminate\Support\Facades\Storage::disk('public')->putFileAs('uploads', $file, $fileName);
                    $fileUrl = '/storage/' . $path;
                    $saved = true;
                } catch (\Throwable $storageEx) {
                    \Illuminate\Support\Facades\Log::warning("Storage disk putFileAs failed: " . $storageEx->getMessage());
                }
            }

            // Strategy 3: Direct file_put_contents if move failed
            if (!$saved) {
                try {
                    $bytes = file_get_contents($file->getRealPath());
                    if (is_dir($targetDir)) {
                        file_put_contents($targetDir . DIRECTORY_SEPARATOR . $fileName, $bytes);
                        $fileUrl = '/uploads/' . $fileName;
                        $saved = true;
                    }
                } catch (\Throwable $putEx) {
                    \Illuminate\Support\Facades\Log::warning("file_put_contents failed: " . $putEx->getMessage());
                }
            }

            if (!$saved) {
                try {
                    $bytes = file_get_contents($file->getRealPath());
                    $base64 = base64_encode($bytes);
                    $dataUrl = 'data:' . $mime . ';base64,' . $base64;
                    return response()->json([
                        'success' => true,
                        'url' => $dataUrl,
                        'message' => 'File diproses aman sebagai data URL.',
                    ]);
                } catch (\Throwable $dataEx) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Gagal menyimpan file ke server: ' . $dataEx->getMessage(),
                    ], 500);
                }
            }

            // Auto-sync ke frontend/public/uploads jika folder frontend tersedia
            try {
                $frontendPublic = base_path('../frontend/public/uploads');
                if (file_exists(base_path('../frontend/public'))) {
                    if (!is_dir($frontendPublic)) {
                        @mkdir($frontendPublic, 0777, true);
                    }
                    if (file_exists($targetDir . DIRECTORY_SEPARATOR . $fileName)) {
                        @copy($targetDir . DIRECTORY_SEPARATOR . $fileName, $frontendPublic . DIRECTORY_SEPARATOR . $fileName);
                    }
                }
            } catch (\Throwable $syncEx) {
                // Ignore non-critical sync errors
            }

            return response()->json([
                'success' => true,
                'message' => ($isImage ? 'Foto' : 'Video') . ' berhasil diunggah.',
                'url' => $fileUrl,
                'type' => $isImage ? 'image' : 'video',
                'file_name' => $fileName,
                'size_bytes' => $file->getSize(),
            ]);
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::error('Upload exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan sistem saat unggah: ' . $e->getMessage(),
            ], 500);
        }
    }
}
