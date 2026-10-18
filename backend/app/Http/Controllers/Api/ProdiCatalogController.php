<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use App\Models\CatalogMedia;
use App\Models\CatalogSpec;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProdiCatalogController extends Controller
{
    public function myItems(Request $request): JsonResponse
    {
        $user = $request->user()->load(['role', 'prodi']);

        $query = CatalogItem::with(['category', 'prodi', 'specs', 'media', 'inquiries']);

        // If user is prodi admin, filter by their prodi
        if ($user->role && $user->role->name === 'prodi') {
            $query->where('prodi_id', $user->prodi_id);
        }

        $items = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $items,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();
        $prodiId = $request->input('prodi_id') ?? $user->prodi_id ?? 1;

        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'prodi_id' => 'nullable|exists:prodis,id',
            'nama_item' => 'required|string|max:200',
            'tagline' => 'nullable|string|max:255',
            'deskripsi_singkat' => 'required|string',
            'deskripsi_lengkap' => 'required|string',
            'live_demo_url' => 'nullable|string',
            'model_3d_url' => 'nullable|string',
            'thumbnail_url' => 'required|string',
            'status_publikasi' => 'required|in:draft,published,archived',
            'harga_tipe' => 'required|in:fixed,starting_at,contact_us',
            'harga_nominal' => 'nullable|numeric|min:0',
            'pic_nama' => 'required|string|max:150',
            'pic_kontak' => 'required|string|max:50',
            'pic_laboratorium' => 'nullable|string|max:150',
            'specs' => 'nullable|array',
            'specs.*.group_name' => 'required|string',
            'specs.*.spec_key' => 'required|string',
            'specs.*.spec_value' => 'required|string',
            'media' => 'nullable|array',
            'media.*.file_url' => 'required|string',
            'media.*.media_type' => 'nullable|string',
            'media.*.is_primary' => 'nullable|boolean',
            'media.*.caption' => 'nullable|string',
        ]);

        $slugBase = Str::slug($validated['nama_item']);
        $slug = $slugBase;
        $counter = 1;
        while (CatalogItem::where('slug', $slug)->exists()) {
            $slug = "{$slugBase}-{$counter}";
            $counter++;
        }

        $itemData = collect($validated)->except(['specs', 'media'])->toArray();
        $itemData['prodi_id'] = $prodiId;
        $itemData['slug'] = $slug;
        $itemData['harga_nominal'] = $validated['harga_nominal'] ?? 0;

        $catalogItem = CatalogItem::create($itemData);

        if (!empty($validated['specs'])) {
            foreach ($validated['specs'] as $index => $spec) {
                CatalogSpec::create([
                    'catalog_item_id' => $catalogItem->id,
                    'group_name' => $spec['group_name'] ?? 'General',
                    'spec_key' => $spec['spec_key'],
                    'spec_value' => $spec['spec_value'],
                    'order_index' => $index + 1,
                ]);
            }
        }

        if (!empty($validated['media'])) {
            foreach ($validated['media'] as $mediaItem) {
                if (!empty($mediaItem['file_url'])) {
                    CatalogMedia::create([
                        'catalog_item_id' => $catalogItem->id,
                        'file_url' => $mediaItem['file_url'],
                        'media_type' => $mediaItem['media_type'] ?? 'image',
                        'is_primary' => !empty($mediaItem['is_primary']),
                        'caption' => $mediaItem['caption'] ?? null,
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Item inovasi katalog berhasil ditambahkan.',
            'data' => $catalogItem->load(['category', 'prodi', 'specs', 'media']),
        ], 201);
    }

    public function show(int $id, Request $request): JsonResponse
    {
        $user = $request->user();
        $item = CatalogItem::with(['category', 'prodi', 'specs', 'media', 'inquiries'])->findOrFail($id);

        if ($user->role && $user->role->name === 'prodi' && $item->prodi_id !== $user->prodi_id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $item,
        ]);
    }

    public function update(int $id, Request $request): JsonResponse
    {
        $user = $request->user();
        $catalogItem = CatalogItem::findOrFail($id);

        if ($user->role && $user->role->name === 'prodi' && $catalogItem->prodi_id !== $user->prodi_id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|required|exists:categories,id',
            'prodi_id' => 'sometimes|required|exists:prodis,id',
            'nama_item' => 'sometimes|required|string|max:200',
            'tagline' => 'nullable|string|max:255',
            'deskripsi_singkat' => 'sometimes|required|string',
            'deskripsi_lengkap' => 'sometimes|required|string',
            'live_demo_url' => 'nullable|string',
            'model_3d_url' => 'nullable|string',
            'thumbnail_url' => 'sometimes|required|string',
            'status_publikasi' => 'sometimes|required|in:draft,published,archived',
            'harga_tipe' => 'sometimes|required|in:fixed,starting_at,contact_us',
            'harga_nominal' => 'nullable|numeric|min:0',
            'pic_nama' => 'sometimes|required|string|max:150',
            'pic_kontak' => 'sometimes|required|string|max:50',
            'pic_laboratorium' => 'nullable|string|max:150',
            'specs' => 'nullable|array',
            'specs.*.group_name' => 'required|string',
            'specs.*.spec_key' => 'required|string',
            'specs.*.spec_value' => 'required|string',
            'media' => 'nullable|array',
            'media.*.file_url' => 'required|string',
            'media.*.media_type' => 'nullable|string',
            'media.*.is_primary' => 'nullable|boolean',
            'media.*.caption' => 'nullable|string',
        ]);

        $itemData = collect($validated)->except(['specs', 'media'])->toArray();
        if (array_key_exists('harga_nominal', $validated)) {
            $itemData['harga_nominal'] = $validated['harga_nominal'] ?? 0;
        }

        $catalogItem->update($itemData);

        if (isset($validated['specs'])) {
            CatalogSpec::where('catalog_item_id', $catalogItem->id)->delete();
            foreach ($validated['specs'] as $index => $spec) {
                CatalogSpec::create([
                    'catalog_item_id' => $catalogItem->id,
                    'group_name' => $spec['group_name'] ?? 'General',
                    'spec_key' => $spec['spec_key'],
                    'spec_value' => $spec['spec_value'],
                    'order_index' => $index + 1,
                ]);
            }
        }

        if (isset($validated['media'])) {
            CatalogMedia::where('catalog_item_id', $catalogItem->id)->delete();
            foreach ($validated['media'] as $mediaItem) {
                if (!empty($mediaItem['file_url'])) {
                    CatalogMedia::create([
                        'catalog_item_id' => $catalogItem->id,
                        'file_url' => $mediaItem['file_url'],
                        'media_type' => $mediaItem['media_type'] ?? 'image',
                        'is_primary' => !empty($mediaItem['is_primary']),
                        'caption' => $mediaItem['caption'] ?? null,
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Item katalog berhasil diperbarui.',
            'data' => $catalogItem->load(['category', 'prodi', 'specs', 'media']),
        ]);
    }

    public function destroy(int $id, Request $request): JsonResponse
    {
        $user = $request->user();
        $catalogItem = CatalogItem::findOrFail($id);

        if ($user->role && $user->role->name === 'prodi' && $catalogItem->prodi_id !== $user->prodi_id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $catalogItem->delete();

        return response()->json([
            'success' => true,
            'message' => 'Item katalog berhasil dihapus.',
        ]);
    }

    public function clearAll(Request $request): JsonResponse
    {
        $user = $request->user();
        
        if ($user->role && $user->role->name === 'prodi') {
            $items = CatalogItem::where('prodi_id', $user->prodi_id)->get();
            $count = $items->count();
            foreach ($items as $item) {
                $item->specs()->delete();
                $item->media()->delete();
                $item->inquiries()->delete();
                $item->delete();
            }
            return response()->json([
                'success' => true,
                'message' => "Berhasil menghapus {$count} produk inovasi prodi Anda.",
            ]);
        }

        // Super admin / general
        $count = CatalogItem::count();
        DB::table('catalog_specs')->delete();
        DB::table('catalog_media')->delete();
        DB::table('inquiries')->delete();
        DB::table('catalog_items')->delete();

        return response()->json([
            'success' => true,
            'message' => "Berhasil menghapus seluruh {$count} produk katalog lawas dari sistem.",
        ]);
    }
}

