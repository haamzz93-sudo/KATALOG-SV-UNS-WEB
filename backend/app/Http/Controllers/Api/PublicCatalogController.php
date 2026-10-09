<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatalogItem;
use App\Models\Category;
use App\Models\Inquiry;
use App\Models\Prodi;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicCatalogController extends Controller
{
    public function getCategories(): JsonResponse
    {
        $categories = Category::withCount(['catalogItems' => function ($q) {
            $q->where('status_publikasi', 'published');
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function getProdis(): JsonResponse
    {
        $prodis = Prodi::withCount(['catalogItems' => function ($q) {
            $q->where('status_publikasi', 'published');
        }])->get();

        return response()->json([
            'success' => true,
            'data' => $prodis,
        ]);
    }

    public function index(Request $request): JsonResponse
    {
        $query = CatalogItem::with(['category', 'prodi', 'specs'])
            ->where('status_publikasi', 'published');

        // Filter by Category
        if ($request->filled('category')) {
            $categorySlug = $request->query('category');
            $query->whereHas('category', function ($q) use ($categorySlug) {
                $q->where('slug', $categorySlug);
            });
        }

        // Filter by Prodi
        if ($request->filled('prodi')) {
            $prodiKode = $request->query('prodi');
            $query->whereHas('prodi', function ($q) use ($prodiKode) {
                $q->where('kode_prodi', $prodiKode);
            });
        }

        // Search Keyword
        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('nama_item', 'like', "%{$search}%")
                  ->orWhere('tagline', 'like', "%{$search}%")
                  ->orWhere('deskripsi_singkat', 'like', "%{$search}%")
                  ->orWhere('pic_laboratorium', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sort = $request->query('sort', 'latest');
        if ($sort === 'popular') {
            $query->orderByDesc('view_count');
        } elseif ($sort === 'demo') {
            $query->orderByDesc('demo_click_count');
        } else {
            $query->latest();
        }

        $perPage = (int) $request->query('per_page', 12);
        $items = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $items->items(),
            'pagination' => [
                'current_page' => $items->currentPage(),
                'last_page' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total' => $items->total(),
            ],
        ]);
    }

    public function show(string $slug): JsonResponse
    {
        $normalizedSlug = str_replace('robot-patroli-otonom-arvin-v2', 'robot-patroli-otonom', $slug);

        $item = CatalogItem::with(['category', 'prodi', 'specs', 'media'])
            ->where(function ($q) use ($slug, $normalizedSlug) {
                $q->where('slug', $slug)->orWhere('slug', $normalizedSlug);
            })
            ->where('status_publikasi', 'published')
            ->first();

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Item katalog tidak ditemukan.',
            ], 404);
        }

        // Increment view count
        $item->increment('view_count');

        return response()->json([
            'success' => true,
            'data' => $item,
        ]);
    }

    public function demoClick(int $id): JsonResponse
    {
        $item = CatalogItem::find($id);

        if (!$item) {
            return response()->json([
                'success' => false,
                'message' => 'Item tidak ditemukan.',
            ], 404);
        }

        $item->increment('demo_click_count');

        return response()->json([
            'success' => true,
            'message' => 'Demo click incremented.',
            'demo_click_count' => $item->demo_click_count,
        ]);
    }

    public function submitInquiry(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'catalog_item_id' => 'required|exists:catalog_items,id',
            'nama_pengunjung' => 'required|string|max:150',
            'instansi' => 'required|string|max:150',
            'email' => 'required|email|max:150',
            'no_wa' => 'required|string|max:50',
            'pesan' => 'required|string',
        ]);

        $inquiry = Inquiry::create($validated);

        // Increment inquiry counter on catalog item
        CatalogItem::where('id', $validated['catalog_item_id'])->increment('inquiry_count');

        return response()->json([
            'success' => true,
            'message' => 'Formulir minat & kerja sama berhasil dikirimkan ke pihak Program Studi.',
            'data' => $inquiry,
        ], 201);
    }
}
