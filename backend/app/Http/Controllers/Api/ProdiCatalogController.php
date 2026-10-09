<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use App\Models\CatalogSpec;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
            'live_demo_url' => 'nullable|url|max:500',
            'model_3d_url' => 'nullable|url|max:500',
            'thumbnail_url' => 'required|string|max:500',
            'status_publikasi' => 'required|in:draft,published,archived',
            'harga_tipe' => 'required|in:fixed,starting_at,contact_us',
            'harga_nominal' => 'required|numeric|min:0',
            'pic_nama' => 'required|string|max:150',
            'pic_kontak' => 'required|string|max:50',
            'pic_laboratorium' => 'nullable|string|max:150',
            'specs' => 'nullable|array',
            'specs.*.group_name' => 'required|string',
            'specs.*.spec_key' => 'required|string',
            'specs.*.spec_value' => 'required|string',
        ]);

        $slugBase = Str::slug($validated['nama_item']);
        $slug = $slugBase;
        $counter = 1;
        while (CatalogItem::where('slug', $slug)->exists()) {
            $slug = "{$slugBase}-{$counter}";
            $counter++;
        }

        $itemData = collect($validated)->except('specs')->toArray();
        $itemData['prodi_id'] = $prodiId;
        $itemData['slug'] = $slug;

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

        return response()->json([
            'success' => true,
            'message' => 'Item inovasi katalog berhasil ditambahkan.',
            'data' => $catalogItem->load(['category', 'prodi', 'specs']),
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
            'live_demo_url' => 'nullable|url|max:500',
            'model_3d_url' => 'nullable|url|max:500',
            'thumbnail_url' => 'sometimes|required|string|max:500',
            'status_publikasi' => 'sometimes|required|in:draft,published,archived',
            'harga_tipe' => 'sometimes|required|in:fixed,starting_at,contact_us',
            'harga_nominal' => 'sometimes|required|numeric|min:0',
            'pic_nama' => 'sometimes|required|string|max:150',
            'pic_kontak' => 'sometimes|required|string|max:50',
            'pic_laboratorium' => 'nullable|string|max:150',
            'specs' => 'nullable|array',
            'specs.*.group_name' => 'required|string',
            'specs.*.spec_key' => 'required|string',
            'specs.*.spec_value' => 'required|string',
        ]);

        $itemData = collect($validated)->except('specs')->toArray();
        $catalogItem->update($itemData);

        if (isset($validated['specs'])) {
            // Replace specs
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

        return response()->json([
            'success' => true,
            'message' => 'Item katalog berhasil diperbarui.',
            'data' => $catalogItem->load(['category', 'prodi', 'specs']),
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
}
